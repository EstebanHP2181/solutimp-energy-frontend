import { apiUrl } from './client'

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
}

type EnergyLeadBackendPayload = {
  source: 'calculadora'
  full_name?: string
  phone?: string
  email?: string
  profile?: string
  objective?: string
  monthly_bill_range?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  metadata?: Record<string, unknown>
}

export async function submitEnergyLead(
  payload: EnergyLeadPayload
): Promise<{ ok: boolean; leadId?: string; status?: number }> {
  const url = apiUrl('/api/v1/energy/leads')
  const backendPayload: EnergyLeadBackendPayload = {
    source: 'calculadora',
    full_name: payload.name || undefined,
    phone: payload.phone || undefined,
    email: payload.email || undefined,
    profile: payload.propertyType || undefined,
    objective: payload.mainGoal || undefined,
    monthly_bill_range: payload.consumptionRange || undefined,
    utm_source: payload.utm_source || undefined,
    utm_medium: payload.utm_medium || undefined,
    utm_campaign: payload.utm_campaign || undefined,
    metadata: {
      property_type: payload.propertyType,
      region: payload.region,
      commune_or_address: payload.communeOrAddress,
      accepted_contact: payload.acceptedContact,
      monthly_bill_amount: payload.monthlyBillAmount,
      utm_content: payload.utm_content,
      utm_term: payload.utm_term,
      source_ui: 'calculadora',
    },
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(backendPayload),
    })
    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.warn('[energyLeads] POST no OK', res.status, await res.text().catch(() => ''))
      }
      return { ok: false, status: res.status }
    }
    const data = await res.json().catch(() => ({}))
    return { ok: true, status: res.status, leadId: data?.id }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[energyLeads] POST falló', e)
    }
    return { ok: false }
  }
}
