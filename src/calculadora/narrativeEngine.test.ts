import { describe, expect, it } from 'vitest'
import { getEnergyNarrativeContext } from './narrativeEngine'

describe('getEnergyNarrativeContext', () => {
  it('bodega + respaldo → industrial', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'bodega', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('industrial_infrastructure')
    expect(c.primaryKpiMode).toBe('continuity')
    expect(c.loadingHeadline).toContain('infraestructura')
    expect(c.whatsappIntentLine).toMatch(/operación/i)
  })

  it('empresa + respaldo → commercial continuity', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'empresa', mainGoal: 'respaldo' })
    expect(c.segmentKey).toBe('commercial_continuity')
    expect(c.loadingMessages[0]).toMatch(/continuidad/i)
    expect(c.mainClaim).toMatch(/negocio/i)
  })

  it('casa + ahorro → residential savings', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'casa', mainGoal: 'ahorro' })
    expect(c.segmentKey).toBe('residential_savings')
    expect(c.primaryKpiMode).toBe('savings')
    expect(c.loadingHeadline).toMatch(/hogar/i)
  })

  it('parcela + equipos → agricultural', () => {
    const c = getEnergyNarrativeContext({ propertyType: 'parcela', mainGoal: 'equipos_criticos' })
    expect(c.segmentKey).toBe('agricultural_autonomy')
    expect(c.protectedLoadChips).toContain('Bombas')
  })

  it('selectedCriticalLoads override chips', () => {
    const c = getEnergyNarrativeContext({
      propertyType: 'casa',
      mainGoal: 'ahorro',
      selectedCriticalLoads: ['Custom A', 'Custom B'],
    })
    expect(c.protectedLoadChips).toEqual(['Custom A', 'Custom B'])
  })
})
