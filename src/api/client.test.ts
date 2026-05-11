import { describe, expect, it } from 'vitest'
import { joinApiUrl } from './client'

describe('joinApiUrl', () => {
  it('une base sin slash final y path con slash inicial', () => {
    expect(joinApiUrl('https://energy.solutimp.cl', '/api/v1/energy/bom/auto')).toBe(
      'https://energy.solutimp.cl/api/v1/energy/bom/auto'
    )
  })

  it('normaliza base con slash final', () => {
    expect(joinApiUrl('https://energy.solutimp.cl/', '/api/v1/energy/bom/auto')).toBe(
      'https://energy.solutimp.cl/api/v1/energy/bom/auto'
    )
  })

  it('acepta path sin slash inicial', () => {
    expect(joinApiUrl('https://energy.solutimp.cl', 'api/v1/energy/bom/auto')).toBe(
      'https://energy.solutimp.cl/api/v1/energy/bom/auto'
    )
  })

  it('colapsa barras duplicadas en el path', () => {
    expect(joinApiUrl('https://energy.solutimp.cl', '/api//v1/energy///bom/auto')).toBe(
      'https://energy.solutimp.cl/api/v1/energy/bom/auto'
    )
  })

  it('base vacía devuelve solo path normalizado', () => {
    expect(joinApiUrl('', '/api/v1/energy')).toBe('/api/v1/energy')
    expect(joinApiUrl('   ', 'api/v1/energy')).toBe('/api/v1/energy')
  })

  it('path vacío devuelve base sin slash final o / si no hay base', () => {
    expect(joinApiUrl('https://energy.solutimp.cl', '')).toBe('https://energy.solutimp.cl')
    expect(joinApiUrl('https://energy.solutimp.cl/', '   ')).toBe('https://energy.solutimp.cl')
    expect(joinApiUrl('', '')).toBe('/')
  })
})
