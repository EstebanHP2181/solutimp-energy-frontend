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
}

/**
 * POST /api/v1/energy/leads — si el backend aún no expone el endpoint,
 * no lanzar al caller: devolver ok:false y el caller sigue el flujo UX.
 */
export async function submitEnergyLead(payload: EnergyLeadPayload): Promise<{ ok: boolean; status?: number }> {
  const url = apiUrl('/api/v1/energy/leads')
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.warn('[energyLeads] POST no OK', res.status, await res.text().catch(() => ''))
      }
      return { ok: false, status: res.status }
    }
    return { ok: true, status: res.status }
  } catch (e) {
    // Endpoint ausente, CORS en dev, red, etc.: no bloquear wizard
    if (import.meta.env.DEV) {
      console.warn('[energyLeads] POST falló (conectar backend luego)', e)
    }
    return { ok: false }
  }
}
