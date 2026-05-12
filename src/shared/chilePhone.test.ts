import { describe, expect, it } from 'vitest'
import {
  CHILE_MOBILE_PREFIX,
  getChileMobileValidationError,
  isValidChileMobileDigits8,
  isValidChileMobileE164,
  normalizeChileMobileInput,
  normalizeChileMobileToE164,
  sanitizeChileMobileDigits8,
} from './chilePhone'

describe('normalizeChileMobileInput', () => {
  it('normaliza 8 dígitos locales', () => {
    expect(normalizeChileMobileInput('12345678')).toBe('+56912345678')
  })
  it('normaliza E.164 y prefijo 569 sin +', () => {
    expect(normalizeChileMobileInput('+56912345678')).toBe('+56912345678')
    expect(normalizeChileMobileInput('56912345678')).toBe('+56912345678')
  })
  it('normaliza formato nacional 9 dígitos con separadores', () => {
    expect(normalizeChileMobileInput('9 1234 5678')).toBe('+56912345678')
  })
  it('elimina letras y símbolos antes de normalizar', () => {
    expect(normalizeChileMobileInput('tel:+569-12-34-56-78')).toBe('+56912345678')
    expect(normalizeChileMobileInput('abc56x9x12x34x56x78')).toBe('+56912345678')
  })
})

describe('isValidChileMobileE164', () => {
  it('acepta solo +569 y 8 dígitos sin 0 inicial', () => {
    expect(isValidChileMobileE164('+56912345678')).toBe(true)
    expect(isValidChileMobileE164('+56991234567')).toBe(true)
  })
  it('rechaza formato incorrecto', () => {
    expect(isValidChileMobileE164('56912345678')).toBe(false)
    expect(isValidChileMobileE164('+5691234567')).toBe(false)
    expect(isValidChileMobileE164('+56901234567')).toBe(false)
  })
})

describe('getChileMobileValidationError', () => {
  it('devuelve null si es válido', () => {
    expect(getChileMobileValidationError('12345678')).toBe(null)
    expect(getChileMobileValidationError('+56912345678')).toBe(null)
  })
  it('vacío sin mensaje', () => {
    expect(getChileMobileValidationError('')).toBe(null)
    expect(getChileMobileValidationError('   ')).toBe(null)
  })
  it('menos de 8 dígitos (solo abonado)', () => {
    expect(getChileMobileValidationError('1234567')).toMatch(/Faltan/)
  })
  it('más de 8 dígitos sin formato 569 ni nacional 9 dígitos', () => {
    expect(getChileMobileValidationError('123456789')).toMatch(/Demasiados/)
  })
  it('569 incompleto o con demasiados dígitos', () => {
    expect(getChileMobileValidationError('5691234567')).toMatch(/Faltan/)
    expect(getChileMobileValidationError('5691234567890')).toMatch(/Demasiados/)
  })
})

describe('sanitizeChileMobileDigits8 (onboarding)', () => {
  it('strips non-digits and caps at 8', () => {
    expect(sanitizeChileMobileDigits8('12a34b56c78')).toBe('12345678')
    expect(sanitizeChileMobileDigits8('12345678901')).toBe('12345678')
  })
})

describe('isValidChileMobileDigits8 / normalizeChileMobileToE164 (onboarding)', () => {
  it('acepta 8 dígitos no empezando en 0', () => {
    expect(isValidChileMobileDigits8('91234567')).toBe(true)
    expect(normalizeChileMobileToE164('91234567')).toBe('+56991234567')
  })
  it('rechaza longitud o 0 inicial', () => {
    expect(isValidChileMobileDigits8('9123456')).toBe(false)
    expect(normalizeChileMobileToE164('01234567')).toBe(null)
  })
})

describe('CHILE_MOBILE_PREFIX', () => {
  it('es +569', () => {
    expect(CHILE_MOBILE_PREFIX).toBe('+569')
  })
})
