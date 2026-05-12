import { describe, expect, it } from 'vitest'
import { getEnergyNarrativeContext } from './narrativeEngine'
import {
  narrativeContainsForbidden,
  resolveNarrativeSegment,
  SEGMENT_MATRIX,
} from './semanticDecisionEngine'

/** Texto que actúa como claim principal en pantalla (excluye secciones secundarias tipo backup). */
function dominantTitularBundle(c: ReturnType<typeof getEnergyNarrativeContext>): string {
  return [c.resultTitle, c.mainClaim, c.loadingHeadline, c.loadingSubcopy].join(' ').toLowerCase()
}

describe('resolveNarrativeSegment', () => {
  it('parcela + vender_excedente → export_rural (no industrial_continuity)', () => {
    expect(resolveNarrativeSegment({ propertyType: 'parcela', mainGoal: 'vender_excedente' })).toBe(
      'export_rural',
    )
  })

  it('normaliza alias vender_excedentes → mismo segmento export', () => {
    expect(
      resolveNarrativeSegment({
        propertyType: 'parcela',
        mainGoal: 'vender_excedentes' as unknown as import('@/composables/useCalculadoraFlow').CalcMainGoal,
      }),
    ).toBe('export_rural')
  })

  it('bodega + vender_excedente → export_business (no industrial_continuity)', () => {
    expect(resolveNarrativeSegment({ propertyType: 'bodega', mainGoal: 'vender_excedente' })).toBe(
      'export_business',
    )
    expect(resolveNarrativeSegment({ propertyType: 'bodega', mainGoal: 'vender_excedente' })).not.toBe(
      'industrial_continuity',
    )
  })

  it('empresa + ahorro → savings_business', () => {
    expect(resolveNarrativeSegment({ propertyType: 'empresa', mainGoal: 'ahorro' })).toBe('savings_business')
  })

  it('casa + respaldo → backup_residential', () => {
    expect(resolveNarrativeSegment({ propertyType: 'casa', mainGoal: 'respaldo' })).toBe('backup_residential')
  })

  it('casa + ahorro → savings_residential', () => {
    expect(resolveNarrativeSegment({ propertyType: 'casa', mainGoal: 'ahorro' })).toBe('savings_residential')
  })
})

describe('parcela + vender_excedente narrativa', () => {
  it('no usa hogar, respaldo ni continuidad como titular dominante en copy principal', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'parcela', mainGoal: 'vender_excedente' })
    expect(c.segmentKey).toBe('export_rural')
    const dominant = dominantTitularBundle(c)
    expect(dominant).not.toMatch(/\bhogar\b/)
    expect(dominant).not.toMatch(/\brespaldo\b/)
    expect(dominant).not.toMatch(/\bcontinuidad\b/)
    for (const term of SEGMENT_MATRIX.export_rural.forbiddenTerms) {
      if (!term) continue
      expect(dominant.includes(term.toLowerCase()), `no debería aparecer «${term}» en titular`).toBe(false)
    }
  })
})

describe('empresa + ahorro (savings_business)', () => {
  it('copy agregada no viola términos prohibidos del segmento (sin hogar ni familia)', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'empresa', mainGoal: 'ahorro' })
    expect(c.segmentKey).toBe('savings_business')
    const blob = [
      c.resultTitle,
      c.mainClaim,
      c.loadingHeadline,
      c.loadingSubcopy,
      c.whatsappIntentLine,
      c.narrativeConsumptionHint,
    ].join(' ')
    expect(narrativeContainsForbidden(blob, 'savings_business')).toBeNull()
    expect(blob.toLowerCase()).not.toMatch(/\bhogar\b/)
    expect(blob.toLowerCase()).not.toMatch(/\bfamilia\b/)
  })
})

describe('casa + respaldo vs casa + ahorro (prioridad KPI)', () => {
  it('casa + respaldo prioriza continuidad / autonomía (KPI continuidad)', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'casa', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('backup_residential')
    expect(c.primaryKpiMode).toBe('continuity')
    const head = `${c.resultTitle} ${c.mainClaim}`.toLowerCase()
    expect(head).toMatch(/continuidad|autonom|hogar|funcionando/)
  })

  it('casa + ahorro prioriza ahorro (KPI savings)', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'casa', mainGoal: 'ahorro' })
    expect(c.segmentKey).toBe('savings_residential')
    expect(c.primaryKpiMode).toBe('savings')
  })
})

describe('vender_excedente — léxico de generación / excedentes', () => {
  it('incluye generación, potencial, excedentes o producción en copy principal', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'parcela', mainGoal: 'vender_excedente' })
    const t = dominantTitularBundle(c).normalize('NFD').replace(/\p{M}/gu, '')
    expect(t).toMatch(/generacion|potencial|excedentes|produccion/)
  })
})

describe('narrativeContainsForbidden', () => {
  it('detecta frases prohibidas del segmento', () => {
    expect(narrativeContainsForbidden('Tu hogar sigue funcionando', 'export_rural')).toBe(
      'tu hogar sigue funcionando',
    )
    expect(narrativeContainsForbidden('Plan de generación en parcela', 'export_rural')).toBeNull()
  })
})
