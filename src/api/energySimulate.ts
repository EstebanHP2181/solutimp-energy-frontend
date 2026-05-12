import { apiUrl } from './client'

export type SimulateApiRequest = {
  property_type: string
  consumption_range: string
  main_goal: string
  region: string
}

export type TariffInfo = {
  distributor?: string
  kwh_price_clp?: number
  fixed_charge_clp?: number
  tariff_date?: string
  confidence?: string
}

export type SystemInfo = {
  panels?: number
  power_kwp?: number
  panel_model?: string
  inverter?: string
  includes_battery?: boolean
}

export type EconomicsInfo = {
  bill_current?: number
  bill_new?: number
  current_bill_estimate?: number
  new_bill_estimate?: number
  monthly_savings_min?: number
  monthly_savings_max?: number
  annual_savings?: number
  lifetime_savings_25y?: number
  system_price?: number
  investment_estimate?: number
  roi_years?: number
  installment_60?: number
  installment_120?: number
  monthly_installment_60?: number
  monthly_installment_120?: number
}

export type BackupInfo = {
  available?: boolean
  protected_equipment?: string[]
}

export type SimulationResult = {
  system?: SystemInfo
  power_kwp?: number
  panels?: number
  panel_model?: string
  inverter?: string
  includes_battery?: boolean
  economics?: EconomicsInfo
  tariff?: TariffInfo
  backup?: BackupInfo
  disclaimer?: string
}

function num(obj: Record<string, unknown> | undefined, ...keys: string[]): number | undefined {
  if (!obj) return undefined
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v)
  }
  return undefined
}

function str(obj: Record<string, unknown> | undefined, ...keys: string[]): string | undefined {
  if (!obj) return undefined
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.trim()) return v
  }
  return undefined
}

function bool(obj: Record<string, unknown> | undefined, ...keys: string[]): boolean | undefined {
  if (!obj) return undefined
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'boolean') return v
  }
  return undefined
}

/** Normaliza respuesta JSON (system, economics, tariff, backup, disclaimer). */
export function normalizeSimulationPayload(raw: unknown): SimulationResult | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const sysRaw = (r.system as Record<string, unknown>) || undefined
  const econ = (r.economics as Record<string, unknown>) || {}
  const tariffRaw = (r.tariff as Record<string, unknown>) || undefined
  const backupRaw = (r.backup as Record<string, unknown>) || undefined

  const panels = num(sysRaw, 'panels', 'num_panels') ?? num(r, 'panels', 'num_panels', 'cantidad_paneles')
  const power_kwp = num(sysRaw, 'power_kwp', 'kwp', 'potencia_kwp') ?? num(r, 'power_kwp', 'kwp', 'potencia_kwp')
  const panel_model = str(sysRaw, 'panel_model', 'modelo_panel') ?? str(r, 'panel_model', 'modelo_panel')
  const inverter = str(sysRaw, 'inverter', 'inversor') ?? str(r, 'inverter', 'inversor')
  const includes_battery =
    bool(sysRaw, 'includes_battery', 'bateria_incluida', 'battery_included') ??
    bool(r, 'includes_battery', 'bateria_incluida', 'battery_included')

  const system: SystemInfo | undefined =
    sysRaw || panels != null || power_kwp != null
      ? {
          panels: panels ?? undefined,
          power_kwp: power_kwp ?? undefined,
          panel_model,
          inverter,
          includes_battery: includes_battery ?? undefined,
        }
      : undefined

  const economics: EconomicsInfo = {
    bill_current: num(econ, 'bill_current', 'boleta_actual', 'current_bill'),
    bill_new: num(econ, 'bill_new', 'boleta_nueva', 'new_bill', 'nueva_boleta'),
    current_bill_estimate: num(econ, 'current_bill_estimate', 'bill_current', 'boleta_actual_estimada'),
    new_bill_estimate: num(econ, 'new_bill_estimate', 'bill_new', 'nueva_boleta_estimada'),
    monthly_savings_min: num(
      econ,
      'monthly_savings_min',
      'ahorro_mensual_min',
      'savings_monthly_min',
      'ahorro_mensual_minimo'
    ),
    monthly_savings_max: num(
      econ,
      'monthly_savings_max',
      'ahorro_mensual_max',
      'savings_monthly_max',
      'ahorro_mensual_maximo'
    ),
    annual_savings: num(econ, 'annual_savings', 'ahorro_anual', 'savings_annual'),
    lifetime_savings_25y: num(econ, 'lifetime_savings_25y', 'ahorro_25_anios', 'savings_25y'),
    system_price: num(econ, 'system_price', 'precio_sistema', 'price'),
    investment_estimate: num(econ, 'investment_estimate', 'system_price', 'precio_sistema', 'inversion_estimada'),
    roi_years: num(econ, 'roi_years', 'roi', 'retorno_anios'),
    installment_60: num(econ, 'installment_60', 'cuota_60', 'cuota_60_meses'),
    installment_120: num(econ, 'installment_120', 'cuota_120', 'cuota_120_meses', 'cuota_10_anios'),
    monthly_installment_60: num(
      econ,
      'monthly_installment_60',
      'installment_60',
      'cuota_mensual_60',
      'cuota_60'
    ),
    monthly_installment_120: num(
      econ,
      'monthly_installment_120',
      'installment_120',
      'cuota_mensual_120',
      'cuota_120'
    ),
  }

  const tariff: TariffInfo | undefined = tariffRaw
    ? {
        distributor: str(tariffRaw, 'distributor', 'distribuidora', 'empresa_distribuidora'),
        kwh_price_clp: num(tariffRaw, 'kwh_price_clp', 'precio_kwh', 'kwh_price'),
        fixed_charge_clp: num(tariffRaw, 'fixed_charge_clp', 'cargo_fijo', 'cargo_fijo_mensual'),
        tariff_date: str(tariffRaw, 'tariff_date', 'fecha_tarifa', 'vigencia'),
        confidence: str(tariffRaw, 'confidence', 'confianza'),
      }
    : undefined

  const equipment = backupRaw?.protected_equipment
  const protected_equipment = Array.isArray(equipment)
    ? equipment.filter((x): x is string => typeof x === 'string')
    : undefined

  const backup: BackupInfo | undefined = backupRaw
    ? {
        available: bool(backupRaw, 'available', 'disponible'),
        protected_equipment,
      }
    : undefined

  return {
    system,
    panels: panels ?? undefined,
    power_kwp: power_kwp ?? undefined,
    panel_model,
    inverter,
    includes_battery: includes_battery ?? undefined,
    economics,
    tariff,
    backup,
    disclaimer: str(r, 'disclaimer', 'legal', 'aviso'),
  }
}

export async function postSimulate(body: SimulateApiRequest): Promise<SimulationResult | null> {
  const url = apiUrl('/api/v1/energy/simulate')
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.warn('[energySimulate] POST', res.status, text)
      }
      return null
    }
    let json: unknown
    try {
      json = JSON.parse(text) as unknown
    } catch {
      return null
    }
    return normalizeSimulationPayload(json)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[energySimulate] error', e)
    }
    return null
  }
}
