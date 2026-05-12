import { describe, expect, it } from 'vitest'
import {
  estimateRequiredSurface,
  getRoofFeasibilityCopy,
  getSurfaceEquivalence,
} from './roofFeasibilityEngine'

describe('estimateRequiredSurface', () => {
  it.each([
    [8, 27],
    [10, 34],
    [12, 41],
    [20, 68],
  ])('%i paneles => %i m²', (panels, expected) => {
    expect(estimateRequiredSurface({ panelCount: panels, propertyType: 'casa' })).toBe(expected)
  })

  it('0 paneles => null', () => {
    expect(estimateRequiredSurface({ panelCount: 0, propertyType: 'casa' })).toBeNull()
  })

  it('paneles null/undefined => null', () => {
    expect(estimateRequiredSurface({ panelCount: null, propertyType: 'casa' })).toBeNull()
    expect(estimateRequiredSurface({ panelCount: undefined, propertyType: 'casa' })).toBeNull()
  })

  it('paneles no finitos => null', () => {
    expect(estimateRequiredSurface({ panelCount: Number.NaN, propertyType: 'casa' })).toBeNull()
  })
})

describe('getRoofFeasibilityCopy', () => {
  it('bodega no usa techo despejado como contexto principal', () => {
    const c = getRoofFeasibilityCopy({ panelCount: 10, propertyType: 'bodega' })
    expect(c).not.toBeNull()
    expect(c!.contextLine.toLowerCase()).not.toContain('techo despejado')
    expect(c!.contextLine.toLowerCase()).toContain('cubierta')
  })

  it('>= 80 m² activa advertencia avanzada (visita o satelital)', () => {
    // 24 paneles => ceil(80.64) = 81 m²
    const c = getRoofFeasibilityCopy({ panelCount: 24, propertyType: 'empresa' })
    expect(c).not.toBeNull()
    expect(c!.advancedWarning).toMatch(/visita o análisis satelital/i)
  })

  it('casa usa techumbre útil en titular', () => {
    const c = getRoofFeasibilityCopy({ panelCount: 10, propertyType: 'casa' })
    expect(c).not.toBeNull()
    expect(c!.headline).toMatch(/techumbre útil/i)
  })

  it('debajo de 80 m² sin advertencia avanzada', () => {
    const c = getRoofFeasibilityCopy({ panelCount: 20, propertyType: 'casa' })
    expect(c).not.toBeNull()
    expect(c!.advancedWarning).toBeNull()
  })
})

describe('getSurfaceEquivalence', () => {
  it('solo casa/parcela', () => {
    expect(getSurfaceEquivalence({ panelCount: 8, propertyType: 'casa' })).toMatch(/estacionamiento/i)
    expect(getSurfaceEquivalence({ panelCount: 8, propertyType: 'parcela' })).toMatch(/estacionamiento/i)
    expect(getSurfaceEquivalence({ panelCount: 8, propertyType: 'bodega' })).toBeNull()
    expect(getSurfaceEquivalence({ panelCount: 8, propertyType: 'empresa' })).toBeNull()
  })
})
