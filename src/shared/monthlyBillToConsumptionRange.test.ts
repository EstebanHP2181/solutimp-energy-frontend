import { describe, expect, it } from 'vitest'
import {
  consumptionRangeForPrudentSimulate,
  monthlyBillAmountToConsumptionRange,
} from './monthlyBillToConsumptionRange'

describe('monthlyBillAmountToConsumptionRange', () => {
  it('menos_50k for amounts below 50k', () => {
    expect(monthlyBillAmountToConsumptionRange(0)).toBe('menos_50k')
    expect(monthlyBillAmountToConsumptionRange(49_999)).toBe('menos_50k')
  })
  it('50k_100k inclusive band', () => {
    expect(monthlyBillAmountToConsumptionRange(50_000)).toBe('50k_100k')
    expect(monthlyBillAmountToConsumptionRange(75_000)).toBe('50k_100k')
    expect(monthlyBillAmountToConsumptionRange(99_999)).toBe('50k_100k')
  })
  it('100k_200k inclusive band', () => {
    expect(monthlyBillAmountToConsumptionRange(100_000)).toBe('100k_200k')
    expect(monthlyBillAmountToConsumptionRange(199_999)).toBe('100k_200k')
  })
  it('mas_200k from 200k', () => {
    expect(monthlyBillAmountToConsumptionRange(200_000)).toBe('mas_200k')
    expect(monthlyBillAmountToConsumptionRange(900_000)).toBe('mas_200k')
  })
})

describe('consumptionRangeForPrudentSimulate', () => {
  it('baja un escalón en 100k_200k para ahorro/empresa/vacío (sin tocar CRM base)', () => {
    expect(consumptionRangeForPrudentSimulate(150_000, 'ahorro')).toBe('50k_100k')
    expect(consumptionRangeForPrudentSimulate(150_000, '')).toBe('50k_100k')
    expect(consumptionRangeForPrudentSimulate(150_000, 'empresa')).toBe('50k_100k')
    expect(monthlyBillAmountToConsumptionRange(150_000)).toBe('100k_200k')
  })

  it('no baja si el foco es continuidad o protección', () => {
    expect(consumptionRangeForPrudentSimulate(150_000, 'respaldo')).toBe('100k_200k')
    expect(consumptionRangeForPrudentSimulate(150_000, 'equipos_criticos')).toBe('100k_200k')
  })

  it('no altera vender_excedente ni mas_200k', () => {
    expect(consumptionRangeForPrudentSimulate(150_000, 'vender_excedente')).toBe('100k_200k')
    expect(consumptionRangeForPrudentSimulate(250_000, 'ahorro')).toBe('mas_200k')
  })
})
