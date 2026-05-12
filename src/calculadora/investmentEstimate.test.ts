import { describe, expect, it } from 'vitest'
import {
  COST_BASE_KWP,
  LABOR_PER_KWP,
  MARGIN_FACTOR,
  VAT_FACTOR,
  estimateTotalInvestmentClp,
  formatMillionsClpLabel,
  preliminaryInvestmentDisplayLine,
} from './investmentEstimate'

describe('estimateTotalInvestmentClp', () => {
  it('aplica margen 30%, mano de obra 200k/kWp e IVA 19%', () => {
    const kwp = 5
    const base = kwp * COST_BASE_KWP * MARGIN_FACTOR + kwp * LABOR_PER_KWP
    expect(estimateTotalInvestmentClp(kwp)).toBe(Math.round(base * VAT_FACTOR))
    expect(MARGIN_FACTOR).toBe(1.3)
    expect(LABOR_PER_KWP).toBe(200_000)
    expect(VAT_FACTOR).toBe(1.19)
  })
})

describe('formatMillionsClpLabel', () => {
  it('formatea millones con un decimal bajo 10M', () => {
    expect(formatMillionsClpLabel(8_900_000)).toMatch(/8,9 millones/)
  })
})

describe('preliminaryInvestmentDisplayLine', () => {
  it('devuelve línea “desde” con IVA incluido', () => {
    const line = preliminaryInvestmentDisplayLine(5)
    expect(line).toMatch(/Inversión preliminar desde/i)
    expect(line).toMatch(/IVA incluido/i)
  })
})
