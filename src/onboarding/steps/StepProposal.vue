<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { wizardInjectionKey } from '@/composables/useWizard'
import { useSavingsRangeAnimation } from '@/composables/useSavingsRangeAnimation'
import { useCountUp } from '@/composables/useCountUp'
import { useInViewChildren } from '@/composables/useInViewAttribute'
import { formatCLP } from '@/shared/formatCLP'

const w = inject(wizardInjectionKey)!

const rootRef = ref<HTMLElement | null>(null)
useInViewChildren(rootRef)

const sim = computed(() => w.simulationResult)
const econ = computed(() => sim.value?.economics)
const tariff = computed(() => sim.value?.tariff)
const backup = computed(() => sim.value?.backup)

const panels = computed(() => sim.value?.system?.panels ?? sim.value?.panels)
const powerKwp = computed(() => sim.value?.system?.power_kwp ?? sim.value?.power_kwp)
const panelModel = computed(() => sim.value?.system?.panel_model ?? sim.value?.panel_model)
const inverter = computed(() => sim.value?.system?.inverter ?? sim.value?.inverter)
const includesBattery = computed(
  () => !!(sim.value?.system?.includes_battery ?? sim.value?.includes_battery)
)

const subtitleLine = computed(() => {
  const p = panels.value
  const k = powerKwp.value
  const inv = inverter.value
  const parts: string[] = []
  if (p != null) parts.push(`${p} paneles solares`)
  if (k != null) parts.push(`${k} kWp`)
  if (inv) parts.push(inv)
  return parts.length ? parts.join(' · ') : 'Sistema dimensionado según tu perfil y región'
})

const currentBill = computed(
  () => econ.value?.current_bill_estimate ?? econ.value?.bill_current
)
const newBill = computed(() => econ.value?.new_bill_estimate ?? econ.value?.bill_new)

const monthlyAvgSavings = computed(() => {
  const e = econ.value
  const a = e?.monthly_savings_min
  const b = e?.monthly_savings_max
  if (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a) && Number.isFinite(b)) {
    return Math.round((a + b) / 2)
  }
  return null
})

const barPct = computed(() => {
  const cur = currentBill.value
  const neu = newBill.value
  if (cur == null || neu == null || cur <= 0) return { cur: 55, neu: 35 }
  const total = cur + neu
  const curW = Math.round((cur / total) * 100)
  const neuW = 100 - curW
  return { cur: Math.max(18, curW), neu: Math.max(18, neuW) }
})

const hasSavingsRange = computed(() => {
  const e = econ.value
  const a = e?.monthly_savings_min
  const b = e?.monthly_savings_max
  if (typeof a !== 'number' || typeof b !== 'number' || !Number.isFinite(a) || !Number.isFinite(b)) return false
  return Math.max(a, b) > 0
})

const anim = useSavingsRangeAnimation(800)
watch(
  () => [econ.value?.monthly_savings_min, econ.value?.monthly_savings_max] as const,
  ([min, max]) => {
    if (typeof min === 'number' && typeof max === 'number' && Math.max(min, max) > 0) {
      anim.start(min, max)
    }
  },
  { immediate: true }
)

const cuAnnual = useCountUp(850)
const cuLifetime = useCountUp(900)
const cuAvgMonthly = useCountUp(800)

watch(monthlyAvgSavings, (avg) => {
  if (avg != null && avg > 0) {
    cuAvgMonthly.start(avg)
  }
}, { immediate: true })

const metricsEl = ref<HTMLElement | null>(null)
let metricsObs: IntersectionObserver | null = null

function reducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

function startMetricCounters() {
  const e = econ.value
  if (e?.annual_savings != null && e.annual_savings > 0) cuAnnual.start(e.annual_savings)
  if (e?.lifetime_savings_25y != null && e.lifetime_savings_25y > 0) cuLifetime.start(e.lifetime_savings_25y)
}

onMounted(() => {
  void nextTick(() => {
    if (reducedMotion()) {
      startMetricCounters()
      return
    }
    const el = metricsEl.value
    if (!el) {
      startMetricCounters()
      return
    }
    metricsObs = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          startMetricCounters()
          metricsObs?.disconnect()
          metricsObs = null
        }
      },
      { threshold: 0.12, rootMargin: '0px' }
    )
    metricsObs.observe(el)
  })
})

onUnmounted(() => {
  metricsObs?.disconnect()
})

const investmentDirect = computed(
  () => econ.value?.investment_estimate ?? econ.value?.system_price
)
const inst60 = computed(() => econ.value?.monthly_installment_60 ?? econ.value?.installment_60)
const inst120 = computed(() => econ.value?.monthly_installment_120 ?? econ.value?.installment_120)

const showTariffBlock = computed(
  () =>
    !!(
      tariff.value?.distributor ||
      tariff.value?.kwh_price_clp != null ||
      tariff.value?.fixed_charge_clp != null ||
      tariff.value?.tariff_date
    )
)

const showManualTariffNote = computed(() => tariff.value?.confidence === 'manual_estimate')

function formatTariffDate(s: string | undefined): string {
  if (!s) return '—'
  const d = Date.parse(s)
  if (!Number.isNaN(d)) {
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(d)
  }
  return s
}

function mapEquipmentIcon(label: string): string {
  const L = label.toLowerCase()
  if (L.includes('internet') || L.includes('wifi') || L.includes('red')) return '🌐'
  if (L.includes('cámar') || L.includes('camara') || L.includes('cctv')) return '📹'
  if (L.includes('portón') || L.includes('porton') || L.includes('gate')) return '🚪'
  if (L.includes('soluaccess') || L.includes('domót') || L.includes('domot')) return '🏠'
  if (L.includes('ilumin')) return '💡'
  if (L.includes('refrig') || L.includes('freezer')) return '❄️'
  return '✓'
}

const showBackup = computed(() => backup.value?.available === true)

const showBatteryLine = computed(() => includesBattery.value || showBackup.value)

const waUrl =
  'https://wa.me/56222013315?text=' +
  encodeURIComponent(
    'Hola, completé la evaluación en Solutimp Energy y quiero más información sobre mi propuesta.'
  )

const showTariffModal = ref(false)

function goContact() {
  w.next()
}

function openTariffModal() {
  showTariffModal.value = true
}
function closeTariffModal() {
  showTariffModal.value = false
}

function onModalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeTariffModal()
}
</script>

<template>
  <div ref="rootRef" class="ruuf">
    <!-- BLOQUE 1 — Hero -->
    <section class="ruuf-hero">
      <div class="ruuf-hero-glow" aria-hidden="true" />
      <h1 class="ruuf-h1">Tu propiedad podría dejar de depender de las alzas de la luz</h1>
      <p class="ruuf-sub">{{ subtitleLine }}</p>
      <p class="ruuf-badge">Compatible con respaldo, domótica y SoluAccess</p>

      <div class="ruuf-savings">
        <template v-if="hasSavingsRange">
          <p class="ruuf-big" aria-live="polite">{{ anim.label }}</p>
          <p class="ruuf-savings-label">de ahorro mensual estimado</p>
        </template>
        <template v-else>
          <p class="ruuf-big ruuf-big--soft">Ahorro estimado entre 60% y 80%</p>
          <p class="ruuf-savings-label">respecto de tu cuenta actual (rango orientativo, sujeto a evaluación técnica)</p>
        </template>
      </div>
    </section>

    <!-- BLOQUE 2 — Nueva boleta -->
    <section class="ruuf-sec" data-io>
      <h2 class="ruuf-h2">Tu nueva boleta, en perspectiva</h2>
      <div class="ruuf-compare card-hover">
        <div class="ruuf-compare-row">
          <div class="ruuf-compare-label">Boleta actual</div>
          <div class="ruuf-compare-val ruuf-compare-val--old">
            {{ currentBill != null ? formatCLP(currentBill) : 'Según tu perfil' }}
          </div>
        </div>
        <div class="ruuf-bar" aria-hidden="true">
          <div class="ruuf-bar-old" :style="{ width: barPct.cur + '%' }" />
          <div class="ruuf-bar-new" :style="{ width: barPct.neu + '%' }" />
        </div>
        <div class="ruuf-compare-row">
          <div class="ruuf-compare-label">Con energía solar</div>
          <div class="ruuf-compare-val ruuf-compare-val--new">
            {{ newBill != null ? formatCLP(newBill) : 'Estimación inicial' }}
          </div>
        </div>
        <div class="ruuf-avg">
          <span class="ruuf-avg-label">Ahorro mensual promedio</span>
          <span class="ruuf-avg-num">{{
            monthlyAvgSavings != null ? formatCLP(cuAvgMonthly.display) : 'Sujeto a medición'
          }}</span>
        </div>
      </div>
      <p v-if="tariff?.distributor && tariff?.kwh_price_clp != null" class="ruuf-tariff-note">
        Estimación basada en tarifa {{ tariff.distributor }} · {{ formatCLP(tariff.kwh_price_clp) }}/kWh<span
          v-if="tariff.tariff_date"
        >
          · {{ formatTariffDate(tariff.tariff_date) }}</span
        >
      </p>
      <p v-else class="ruuf-tariff-note ruuf-tariff-note--muted">
        Estimación preliminar según región y consumo declarado. La boleta real puede ajustar el cálculo.
      </p>
    </section>

    <!-- BLOQUE 3 — Inversión en números -->
    <section ref="metricsEl" class="ruuf-sec ruuf-metrics" data-io>
      <h2 class="ruuf-h2">Inversión en números</h2>
      <div class="ruuf-grid4">
        <div class="ruuf-mcard card-hover" data-io>
          <span class="ruuf-mcard-l">Ahorro anual</span>
          <span class="ruuf-mcard-v">{{
            econ?.annual_savings != null ? formatCLP(cuAnnual.display) : '—'
          }}</span>
        </div>
        <div class="ruuf-mcard card-hover" data-io>
          <span class="ruuf-mcard-l">Retorno estimado</span>
          <span class="ruuf-mcard-v">{{
            econ?.roi_years != null
              ? `${econ.roi_years.toLocaleString('es-CL', { maximumFractionDigits: 1 })} años`
              : '—'
          }}</span>
        </div>
        <div class="ruuf-mcard card-hover" data-io>
          <span class="ruuf-mcard-l">Ahorro 25 años</span>
          <span class="ruuf-mcard-v">{{
            econ?.lifetime_savings_25y != null ? formatCLP(cuLifetime.display) : '—'
          }}</span>
        </div>
        <div class="ruuf-mcard card-hover" data-io>
          <span class="ruuf-mcard-l">Sistema</span>
          <span class="ruuf-mcard-v ruuf-mcard-v--sm">
            <template v-if="powerKwp != null && panels != null">{{ powerKwp }} kWp · {{ panels }} paneles</template>
            <template v-else>Dimensionado a tu perfil</template>
          </span>
        </div>
      </div>
    </section>

    <!-- BLOQUE 4 — Tu sistema -->
    <section class="ruuf-sec" data-io>
      <h2 class="ruuf-h2">Tu sistema</h2>
      <div class="ruuf-sys card-hover">
        <div class="ruuf-sys-art" aria-hidden="true">
          <svg class="ruuf-svg" viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="#0a84ff" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#00d4ff" stop-opacity="0.5" />
              </linearGradient>
            </defs>
            <rect x="8" y="28" width="22" height="44" rx="3" fill="url(#g1)" opacity="0.85" />
            <rect x="36" y="28" width="22" height="44" rx="3" fill="url(#g1)" opacity="0.7" />
            <rect x="64" y="28" width="22" height="44" rx="3" fill="url(#g1)" opacity="0.55" />
            <rect x="92" y="28" width="22" height="44" rx="3" fill="url(#g1)" opacity="0.4" />
            <path
              d="M130 50 L175 50 L185 40 L185 72 L130 72 Z"
              fill="none"
              stroke="#00c896"
              stroke-width="2"
              opacity="0.9"
            />
            <rect x="188" y="42" width="26" height="28" rx="4" fill="rgba(0,200,150,0.25)" stroke="#00c896" />
          </svg>
        </div>
        <ul class="ruuf-sys-list">
          <li v-if="panels != null && panelModel">
            <strong>{{ panels }}</strong> paneles <span class="ruuf-dim">{{ panelModel }}</span>
          </li>
          <li v-else-if="panels != null"><strong>{{ panels }}</strong> paneles solares</li>
          <li v-if="inverter">1 inversor <strong>{{ inverter }}</strong></li>
          <li v-if="showBatteryLine" class="ruuf-bat">
            <span v-if="includesBattery">Batería de respaldo GoodWe recomendada</span>
            <span v-else>Respaldo evaluable según necesidad</span>
          </li>
        </ul>
        <div class="ruuf-trust">
          <span>GoodWe</span>
          <span>Trina Solar</span>
          <span>JA Solar</span>
          <span>Solutimp Energy</span>
        </div>
      </div>
    </section>

    <!-- BLOQUE 5 — Respaldo -->
    <section v-if="showBackup" class="ruuf-sec ruuf-back" data-io>
      <h2 class="ruuf-h2">Tu hogar sigue funcionando aunque se vaya la luz</h2>
      <p class="ruuf-lead">
        Solutimp Energy permite proyectar respaldo para cargas críticas del hogar o empresa.
      </p>
      <ul class="ruuf-eq">
        <li v-for="(item, i) in backup?.protected_equipment || []" :key="i" class="ruuf-eq-item card-hover">
          <span class="ruuf-eq-ico">{{ mapEquipmentIcon(item) }}</span>
          <span>{{ item }}</span>
        </li>
        <li v-if="!(backup?.protected_equipment?.length)" class="ruuf-eq-item">
          <span class="ruuf-eq-ico">🌐</span><span>Internet</span>
        </li>
        <li v-if="!(backup?.protected_equipment?.length)" class="ruuf-eq-item">
          <span class="ruuf-eq-ico">📹</span><span>Cámaras</span>
        </li>
        <li v-if="!(backup?.protected_equipment?.length)" class="ruuf-eq-item">
          <span class="ruuf-eq-ico">🚪</span><span>Portón automático</span>
        </li>
        <li v-if="!(backup?.protected_equipment?.length)" class="ruuf-eq-item">
          <span class="ruuf-eq-ico">🏠</span><span>SoluAccess / domótica</span>
        </li>
      </ul>
      <p class="ruuf-diff">
        <strong>Diferencial Solutimp:</strong> integración entre energía, automatización, portones, control de acceso
        y domótica.
      </p>
    </section>

    <!-- BLOQUE 6 — Opciones inversión -->
    <section class="ruuf-sec" data-io>
      <h2 class="ruuf-h2">Opciones de inversión referenciales</h2>
      <div class="ruuf-inv3">
        <div class="ruuf-inv card-hover" data-io>
          <h3>Pago directo</h3>
          <p class="ruuf-inv-val">
            {{ investmentDirect != null ? formatCLP(investmentDirect) : '—' }}
          </p>
          <p class="ruuf-inv-hint">Valor referencial del sistema estimado</p>
        </div>
        <div class="ruuf-inv card-hover" data-io>
          <h3>Financiamiento 60 meses</h3>
          <p class="ruuf-inv-val">{{ inst60 != null ? formatCLP(inst60) : '—' }}</p>
          <p class="ruuf-inv-hint">Cuota referencial mensual</p>
        </div>
        <div class="ruuf-inv card-hover" data-io>
          <h3>Financiamiento extendido</h3>
          <p class="ruuf-inv-val">{{ inst120 != null ? formatCLP(inst120) : '—' }}</p>
          <p class="ruuf-inv-hint">Cuota referencial mensual</p>
        </div>
      </div>
      <p class="ruuf-disclaimer-inline">
        Valores referenciales. Financiamiento sujeto a evaluación. Precio final se confirma en visita técnica.
      </p>
    </section>

    <!-- BLOQUE 7 — Tarifa -->
    <section v-if="showTariffBlock" class="ruuf-sec ruuf-tariff-block" data-io>
      <h2 class="ruuf-h2">Tarifa considerada en esta simulación</h2>
      <div class="ruuf-tariff-grid card-hover">
        <div><span class="tk">Distribuidora</span><span class="tv">{{ tariff?.distributor || '—' }}</span></div>
        <div>
          <span class="tk">Tarifa usada</span
          ><span class="tv">{{
            tariff?.kwh_price_clp != null ? `${formatCLP(tariff.kwh_price_clp)}/kWh` : '—'
          }}</span>
        </div>
        <div>
          <span class="tk">Cargo fijo</span
          ><span class="tv">{{
            tariff?.fixed_charge_clp != null ? `${formatCLP(tariff.fixed_charge_clp)}/mes` : '—'
          }}</span>
        </div>
        <div>
          <span class="tk">Vigencia</span><span class="tv">{{ formatTariffDate(tariff?.tariff_date) }}</span>
        </div>
        <div class="ruuf-tariff-span">
          <span class="tk">Estado</span><span class="tv">Estimación preliminar</span>
        </div>
      </div>
      <p v-if="showManualTariffNote" class="ruuf-micro">
        Esta simulación usa una tabla tarifaria interna actualizable. La boleta real puede ajustar el cálculo.
      </p>
      <button type="button" class="ruuf-linkish" @click="openTariffModal">
        Quiero una estimación más precisa con mi boleta
      </button>
    </section>

    <!-- BLOQUE 8 — CTA -->
    <section class="ruuf-sec" data-io>
      <div class="ruuf-final card-hover">
        <h2 class="ruuf-h2 ruuf-h2--light">¿Quieres avanzar con una evaluación técnica real?</h2>
        <p class="ruuf-final-t">
          Un especialista revisará tu caso y podrá preparar una propuesta personalizada.
        </p>
        <button type="button" class="ruuf-btn-pri" @click="goContact">Solicitar evaluación técnica gratuita</button>
        <a class="ruuf-btn-wa wa-pulse" :href="waUrl" target="_blank" rel="noopener noreferrer">WhatsApp con un asesor</a>
        <p class="ruuf-final-foot">Un asesor te contactará en horario hábil.</p>
      </div>
    </section>

    <!-- BLOQUE 9 — Pie -->
    <footer class="ruuf-foot">
      <p>{{ sim?.disclaimer || 'Los valores son referenciales y no constituyen oferta vinculante.' }}</p>
    </footer>

    <!-- Modal placeholder -->
    <Teleport to="body">
      <div
        v-if="showTariffModal"
        class="ruuf-modal-back"
        role="presentation"
        @click.self="closeTariffModal"
        @keydown="onModalKeydown"
      >
        <div
          class="ruuf-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ruuf-modal-title"
          tabindex="-1"
        >
          <h3 id="ruuf-modal-title">Estimación con tu boleta</h3>
          <p>
            Pronto podrás ingresar kWh y monto de tu boleta para recalcular con mayor precisión. Mientras tanto, un
            asesor puede orientarte con una visita técnica gratuita.
          </p>
          <button type="button" class="ruuf-btn-pri ruuf-btn-pri--sm" @click="closeTariffModal">Entendido</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ruuf {
  text-align: left;
}

/* —— Hero —— */
.ruuf-hero {
  position: relative;
  text-align: center;
  padding: 1.25rem 0.5rem 1.75rem;
  margin: -0.35rem -0.5rem 1.25rem;
  border-radius: var(--se-radius-lg);
  overflow: hidden;
  background: linear-gradient(165deg, #041224 0%, #061426 40%, #0a2244 100%);
}

.ruuf-hero-glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 50% 20%, rgba(0, 102, 217, 0.45) 0%, transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.12) 0%, transparent 40%);
  pointer-events: none;
}

.ruuf-h1 {
  position: relative;
  font-size: clamp(1.25rem, 4.2vw, 1.75rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 0.65rem;
  letter-spacing: -0.02em;
}

.ruuf-sub {
  position: relative;
  color: var(--se-text-muted);
  font-size: 0.92rem;
  margin: 0 0 0.75rem;
  line-height: 1.45;
}

.ruuf-badge {
  position: relative;
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--se-cyan);
  border: 1px solid rgba(0, 212, 255, 0.35);
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  margin-bottom: 1rem;
  background: rgba(0, 212, 255, 0.08);
}

.ruuf-savings {
  position: relative;
}

.ruuf-big {
  font-size: clamp(1.5rem, 6vw, 2.15rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  background: linear-gradient(100deg, #fff 0%, #7dd3fc 45%, #00d4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ruuf-big--soft {
  background: none;
  color: var(--se-text);
  font-size: clamp(1.1rem, 4vw, 1.45rem);
}

.ruuf-savings-label {
  margin: 0.45rem 0 0;
  font-size: 0.9rem;
  color: var(--se-text-muted);
}

/* —— Sections —— */
.ruuf-sec {
  margin-bottom: 1.5rem;
}

.ruuf-h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  letter-spacing: -0.01em;
}

.ruuf-h2--light {
  color: #fff;
}

/* —— Comparador boleta —— */
.ruuf-compare {
  border-radius: var(--se-radius-lg);
  padding: 1rem 1rem 1.1rem;
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
}

.ruuf-compare-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.ruuf-compare-label {
  font-size: 0.78rem;
  color: var(--se-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ruuf-compare-val {
  font-size: 1.1rem;
  font-weight: 700;
}

.ruuf-compare-val--old {
  color: #f87171;
}

.ruuf-compare-val--new {
  color: #4ade80;
}

.ruuf-bar {
  display: flex;
  height: 10px;
  border-radius: 99px;
  overflow: hidden;
  margin: 0.65rem 0 0.85rem;
  background: rgba(255, 255, 255, 0.06);
}

.ruuf-bar-old {
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.5), rgba(248, 113, 113, 0.85));
  transition: width 0.6s ease;
}

.ruuf-bar-new {
  background: linear-gradient(90deg, rgba(74, 222, 128, 0.6), rgba(0, 212, 255, 0.75));
  transition: width 0.6s ease;
}

.ruuf-avg {
  text-align: center;
  padding-top: 0.35rem;
  border-top: 1px solid var(--se-glass-border);
  margin-top: 0.35rem;
}

.ruuf-avg-label {
  display: block;
  font-size: 0.75rem;
  color: var(--se-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
}

.ruuf-avg-num {
  font-size: clamp(1.35rem, 5vw, 1.85rem);
  font-weight: 800;
  color: var(--se-cyan);
}

.ruuf-tariff-note {
  font-size: 0.78rem;
  color: var(--se-text-muted);
  margin: 0.65rem 0 0;
  line-height: 1.4;
}

.ruuf-tariff-note--muted {
  opacity: 0.95;
}

/* —— Métricas grid —— */
.ruuf-grid4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
}

@media (max-width: 520px) {
  .ruuf-grid4 {
    grid-template-columns: 1fr;
  }
}

.ruuf-mcard {
  border-radius: var(--se-radius-md);
  padding: 0.85rem 0.75rem;
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ruuf-mcard-l {
  font-size: 0.72rem;
  color: var(--se-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ruuf-mcard-v {
  font-size: 1.15rem;
  font-weight: 800;
}

.ruuf-mcard-v--sm {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
}

/* —— Sistema —— */
.ruuf-sys {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: var(--se-radius-lg);
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
}

@media (min-width: 640px) {
  .ruuf-sys {
    flex-direction: row;
    align-items: center;
  }
}

.ruuf-sys-art {
  flex-shrink: 0;
  width: 100%;
  max-width: 220px;
  margin: 0 auto;
}

.ruuf-svg {
  width: 100%;
  height: auto;
  display: block;
}

.ruuf-sys-list {
  margin: 0;
  padding-left: 1.1rem;
  flex: 1;
  font-size: 0.92rem;
  line-height: 1.55;
}

.ruuf-dim {
  color: var(--se-text-muted);
  font-weight: 500;
}

.ruuf-bat {
  color: var(--se-green);
}

.ruuf-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.ruuf-trust span {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.28rem 0.55rem;
  border-radius: 99px;
  border: 1px solid var(--se-glass-border);
  color: var(--se-text-muted);
}

/* —— Respaldo —— */
.ruuf-lead {
  color: var(--se-text-muted);
  font-size: 0.9rem;
  line-height: 1.45;
  margin: 0 0 0.75rem;
}

.ruuf-eq {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.ruuf-eq-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.65rem;
  border-radius: var(--se-radius-md);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--se-glass-border);
  font-size: 0.88rem;
}

.ruuf-eq-ico {
  font-size: 1.1rem;
  width: 1.5rem;
  text-align: center;
}

.ruuf-diff {
  font-size: 0.84rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0.85rem 0 0;
}

/* —— Inversión 3 cards —— */
.ruuf-inv3 {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

@media (min-width: 720px) {
  .ruuf-inv3 {
    flex-direction: row;
  }
}

.ruuf-inv {
  flex: 1;
  padding: 1rem 0.85rem;
  border-radius: var(--se-radius-lg);
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
}

.ruuf-inv h3 {
  margin: 0 0 0.4rem;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--se-text-muted);
  font-weight: 700;
}

.ruuf-inv-val {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
}

.ruuf-inv-hint {
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: var(--se-text-muted);
  line-height: 1.35;
}

.ruuf-disclaimer-inline {
  font-size: 0.75rem;
  color: var(--se-text-muted);
  margin: 0.75rem 0 0;
  line-height: 1.4;
}

/* —— Tarifa —— */
.ruuf-tariff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
  padding: 0.85rem;
  border-radius: var(--se-radius-lg);
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
}

.ruuf-tariff-span {
  grid-column: 1 / -1;
}

.tk {
  display: block;
  font-size: 0.68rem;
  color: var(--se-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.15rem;
}

.tv {
  font-size: 0.88rem;
  font-weight: 600;
}

.ruuf-micro {
  font-size: 0.78rem;
  color: var(--se-text-muted);
  margin: 0.65rem 0;
  line-height: 1.4;
}

.ruuf-linkish {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 52px;
  margin-top: 0.35rem;
  padding: 0 1rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--se-cyan);
  background: transparent;
  border: 1px dashed rgba(0, 212, 255, 0.45);
  border-radius: var(--se-radius-md);
  cursor: pointer;
}

.ruuf-linkish:hover {
  border-style: solid;
  box-shadow: 0 0 20px rgba(0, 102, 217, 0.25);
}

/* —— CTA final —— */
.ruuf-final {
  text-align: center;
  padding: 1.35rem 1rem;
  border-radius: var(--se-radius-lg);
  background: linear-gradient(145deg, rgba(0, 102, 217, 0.35) 0%, rgba(6, 20, 38, 0.95) 55%);
  border: 1px solid rgba(0, 132, 255, 0.45);
  box-shadow: 0 0 40px rgba(0, 102, 217, 0.2);
}

.ruuf-final-t {
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.92rem;
  margin: 0 0 1rem;
  line-height: 1.45;
}

.ruuf-btn-pri {
  width: 100%;
  min-height: 52px;
  margin-bottom: 0.55rem;
  border: none;
  border-radius: var(--se-radius-md);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, var(--se-blue) 0%, var(--se-blue-electric) 100%);
  box-shadow: 0 4px 24px var(--se-glow);
}

.ruuf-btn-pri:hover {
  filter: brightness(1.06);
}

.ruuf-btn-pri--sm {
  min-height: 44px;
  margin: 0;
}

.ruuf-btn-wa {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 52px;
  border-radius: var(--se-radius-md);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  background: #128c7e;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.ruuf-btn-wa:hover {
  filter: brightness(1.05);
}

.ruuf-final-foot {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
}

/* WhatsApp pulse */
.wa-pulse {
  animation: wa-glow 3s ease-in-out infinite;
}

@keyframes wa-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(18, 140, 126, 0.55);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(18, 140, 126, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wa-pulse {
    animation: none;
  }
}

/* —— Pie —— */
.ruuf-foot {
  font-size: 0.72rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  opacity: 0.9;
  padding-bottom: 0.5rem;
}

.ruuf-foot p {
  margin: 0;
}

/* Intersection reveal */
[data-io] {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}

[data-io][data-io-visible='true'] {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-io] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.card-hover {
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.card-hover:hover {
  box-shadow: 0 0 28px rgba(0, 102, 217, 0.35);
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .card-hover:hover {
    transform: none;
  }
}

/* Modal */
.ruuf-modal-back {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.ruuf-modal {
  max-width: 400px;
  width: 100%;
  padding: 1.25rem;
  border-radius: var(--se-radius-lg);
  background: #0a1628;
  border: 1px solid var(--se-glass-border);
  color: var(--se-text);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.ruuf-modal h3 {
  margin: 0 0 0.65rem;
  font-size: 1.1rem;
}

.ruuf-modal p {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--se-text-muted);
  line-height: 1.45;
}
</style>
