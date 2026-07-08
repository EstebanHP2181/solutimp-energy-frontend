import { apiUrl } from './client'

/** Versión alineada con solutimp.cl/privacidad (PR-PRIV-002). */
export const ENERGY_CONSENT_POLICY_VERSION = '2026-07-15'
export const ENERGY_PRIVACY_POLICY_URL = 'https://solutimp.cl/privacidad'

export type EnergyLeadPayload = {
  propertyType: string
  consumptionRange: string
  mainGoal: string
  region: string
  name: string
  phone: string
  email: string
  communeOrAddress?: string
  acceptedContact: boolean
  monthlyBillAmount?: number
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  /** Default onboarding; calculadora para flujo /calculadora */
  source?: 'onboarding' | 'calculadora'
}

function mapPropertyToProfile(propertyType: string): string {
  const m: Record<string, string> = {
    casa: 'hogar',
    parcela: 'parcela',
    empresa: 'empresa',
    condominio: 'condominio',
    bodega: 'empresa',
  }
  return m[propertyType] ?? 'otro'
}

function mapGoalToObjective(mainGoal: string): string | undefined {
  const m: Record<string, string> = {
    ahorro: 'ahorro',
    respaldo: 'respaldo',
    equipos_criticos: 'continuidad',
    proteger_equipos: 'continuidad',
    vender_excedente: 'vender_excedente',
    vender_excedentes: 'vender_excedente',
    empresa: 'otro',
  }
  return m[mainGoal]
}

function toApiBody(payload: EnergyLeadPayload) {
  const meta: Record<string, unknown> = {
    region: payload.region,
    consumption_range: payload.consumptionRange,
    main_goal: payload.mainGoal,
  }
  if (payload.communeOrAddress) meta.commune_or_address = payload.communeOrAddress
  if (payload.monthlyBillAmount != null) meta.monthly_bill_amount = payload.monthlyBillAmount
  if (payload.utm_content) meta.utm_content = payload.utm_content
  if (payload.utm_term) meta.utm_term = payload.utm_term

  return {
    source: payload.source ?? 'onboarding',
    full_name: payload.name.trim(),
    phone: payload.phone,
    email: payload.email.trim(),
    profile: mapPropertyToProfile(payload.propertyType),
    objective: mapGoalToObjective(payload.mainGoal),
    monthly_bill_range: payload.consumptionRange,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign,
    consent_accepted: payload.acceptedContact,
    consent_policy_version: ENERGY_CONSENT_POLICY_VERSION,
    metadata: meta,
  }
}

export async function submitEnergyLead(payload: EnergyLeadPayload): Promise<{ ok: boolean; status?: number }> {
  const url = apiUrl('/api/v1/energy/leads')
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(toApiBody(payload)),
    })
    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.warn('[energyLeads] POST no OK', res.status, await res.text().catch(() => ''))
      }
      return { ok: false, status: res.status }
    }
    return { ok: true, status: res.status }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[energyLeads] POST falló', e)
    }
    return { ok: false }
  }
}
