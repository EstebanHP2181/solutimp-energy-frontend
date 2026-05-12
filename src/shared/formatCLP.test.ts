import { describe, expect, it } from 'vitest'
import { formatCLP } from './formatCLP'

describe('formatCLP', () => {
  it('usa separador de miles es-CL', () => {
    expect(formatCLP(128000)).toMatch(/128/)
    expect(formatCLP(128000)).toContain('$')
  })

  it('formatea cero', () => {
    expect(formatCLP(0)).toBe('$0')
  })
})
