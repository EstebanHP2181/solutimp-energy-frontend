import { describe, expect, it } from 'vitest'
import { waCondominiumHref, waSpecialistHref } from './energyHomeLinks'

describe('energyHomeLinks', () => {
  it('genera enlaces wa.me con el número comercial (56222013315)', () => {
    expect(waSpecialistHref).toMatch(/^https:\/\/wa\.me\/56222013315\?text=/)
    expect(waCondominiumHref).toMatch(/^https:\/\/wa\.me\/56222013315\?text=/)
  })
})
