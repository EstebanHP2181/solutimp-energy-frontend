import { describe, expect, it } from 'vitest'
import { getEnergyNarrativeContext } from './narrativeEngine'

function concatNonResidentialCopy(c: ReturnType<typeof getEnergyNarrativeContext>): string {
  return [c.resultTitle, c.mainClaim, c.backupTitle, c.backupCopy, c.narrativeConsumptionHint].join(' ')
}

describe('getEnergyNarrativeContext', () => {
  it('bodega + respaldo → industrial_continuity', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'bodega', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('industrial_continuity')
    expect(c.primaryKpiMode).toBe('continuity')
    expect(c.loadingHeadline).toContain('infraestructura')
    expect(c.whatsappIntentLine).toMatch(/operación crítica/i)
    expect(c.referentialAutonomy).toEqual({
      hoursMin: 6,
      hoursMax: 12,
      scopeLine: 'para accesos, seguridad y comunicaciones',
    })
    expect(c.formRevealCtaLabel).toBe('Coordinar diagnóstico de infraestructura')
  })

  it('empresa + respaldo → operational_business', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'empresa', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('operational_business')
    expect(c.loadingMessages[0]).toMatch(/continuidad/i)
    expect(c.mainClaim).toMatch(/negocio/i)
    expect(c.referentialAutonomy).toEqual({
      hoursMin: 4,
      hoursMax: 8,
      scopeLine: 'para operación crítica básica',
    })
    expect(c.formRevealCtaLabel).toBe('Solicitar evaluación operacional')
    expect(concatNonResidentialCopy(c).toLowerCase()).not.toContain('hogar')
  })

  it('casa + ahorro → savings_residential', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'casa', mainGoal: 'ahorro' })
    expect(c.segmentKey).toBe('savings_residential')
    expect(c.primaryKpiMode).toBe('savings')
    expect(c.loadingHeadline).toMatch(/hogar/i)
    expect(c.referentialAutonomy).toBeNull()
    expect(c.formRevealCtaLabel).toContain('ahorro')
  })

  it('casa + respaldo → backup_residential con autonomía 8–14 h', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'casa', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('backup_residential')
    expect(c.referentialAutonomy?.hoursMin).toBe(8)
    expect(c.referentialAutonomy?.hoursMax).toBe(14)
    expect(c.formRevealCtaLabel).toBe('Quiero validar el respaldo de mi hogar')
  })

  it('parcela + equipos → backup_rural', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'parcela', mainGoal: 'equipos_criticos' })
    expect(c.segmentKey).toBe('backup_rural')
    expect(c.primaryKpiMode).toBe('coverage')
    expect(c.protectedLoadChips).toContain('Bombas')
    expect(c.referentialAutonomy).toEqual({
      hoursMin: 8,
      hoursMax: 16,
      scopeLine: 'para cargas esenciales rurales',
    })
    expect(c.formRevealCtaLabel).toBe('Evaluar autonomía energética')
  })

  it('condominio + respaldo → condominium_backup', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'condominio', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('condominium_backup')
    expect(c.referentialAutonomy).toEqual({
      hoursMin: 6,
      hoursMax: 10,
      scopeLine: 'para accesos, CCTV e iluminación común',
    })
    expect(concatNonResidentialCopy(c).toLowerCase()).not.toContain('hogar')
  })

  it('selectedCriticalLoads override chips', () => {
    const c = getEnergyNarrativeContext({
      propertyType: 'casa',
      mainGoal: 'ahorro',
      selectedCriticalLoads: ['Custom A', 'Custom B'],
    })
    expect(c.protectedLoadChips).toEqual(['Custom A', 'Custom B'])
  })

  it('industrial copy no menciona hogar', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'bodega', mainGoal: 'respaldo' })
    expect(concatNonResidentialCopy(c).toLowerCase()).not.toContain('hogar')
  })
})
