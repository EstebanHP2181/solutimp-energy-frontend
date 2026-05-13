import { describe, expect, it } from 'vitest'
import { inferRegionFromText } from './inferRegionFromText'

describe('inferRegionFromText', () => {
  it('detecta RM desde comunas conocidas', () => {
    expect(inferRegionFromText('Las Condes')).toBe('RM')
    expect(inferRegionFromText('Providencia, Santiago')).toBe('RM')
    expect(inferRegionFromText('Ñuñoa')).toBe('RM')
    expect(inferRegionFromText('Región Metropolitana')).toBe('RM')
  })

  it('detecta otras regiones', () => {
    expect(inferRegionFromText('Valparaíso')).toBe('V')
    expect(inferRegionFromText('Viña del Mar')).toBe('V')
    expect(inferRegionFromText('Concepción')).toBe('VIII')
    expect(inferRegionFromText('Chillán')).toBe('XVI')
    expect(inferRegionFromText('Temuco')).toBe('IX')
    expect(inferRegionFromText('Antofagasta')).toBe('II')
    expect(inferRegionFromText('La Serena')).toBe('IV')
    expect(inferRegionFromText('Rancagua')).toBe('VI')
    expect(inferRegionFromText('Talca')).toBe('VII')
    expect(inferRegionFromText('Puerto Montt')).toBe('X')
    expect(inferRegionFromText('Valdivia')).toBe('XIV')
    expect(inferRegionFromText('Iquique')).toBe('I')
    expect(inferRegionFromText('Arica')).toBe('XV')
    expect(inferRegionFromText('Copiapó')).toBe('III')
    expect(inferRegionFromText('Punta Arenas')).toBe('XII')
    expect(inferRegionFromText('Coyhaique')).toBe('XI')
  })

  it('devuelve null si no hay coincidencia clara', () => {
    expect(inferRegionFromText('')).toBeNull()
    expect(inferRegionFromText('x')).toBeNull()
    expect(inferRegionFromText('comuna inventada xyz')).toBeNull()
  })
})
