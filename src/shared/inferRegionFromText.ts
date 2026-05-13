/**
 * Infiere código de región (CHILE_REGIONS.value) desde texto libre (comuna, ciudad, dirección).
 * Sin APIs externas. Primera coincidencia por palabra clave (keywords más largas primero).
 */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/['']/g, '')
}

/**
 * Pares [keyword normalizada, código región].
 * Orden: se reordena por longitud de keyword descendente al construir.
 */
const KEYWORD_REGION_RAW: [string, string][] = [
  // RM
  ['region metropolitana', 'RM'],
  ['metropolitana', 'RM'],
  ['estacion central', 'RM'],
  ['las condes', 'RM'],
  ['lo barnechea', 'RM'],
  ['penalolen', 'RM'],
  ['puente alto', 'RM'],
  ['providencia', 'RM'],
  ['vitacura', 'RM'],
  ['quilicura', 'RM'],
  ['la florida', 'RM'],
  ['san miguel', 'RM'],
  ['santiago', 'RM'],
  ['maipu', 'RM'],
  ['nunoa', 'RM'],
  ['pudahuel', 'RM'],
  ['macul', 'RM'],
  // V
  ['vina del mar', 'V'],
  ['villa alemana', 'V'],
  ['san antonio', 'V'],
  ['valparaiso', 'V'],
  ['quillota', 'V'],
  ['quilpue', 'V'],
  ['los andes', 'V'],
  // VIII
  ['los angeles', 'VIII'],
  ['talcahuano', 'VIII'],
  ['chiguayante', 'VIII'],
  ['concepcion', 'VIII'],
  ['coronel', 'VIII'],
  ['biobio', 'VIII'],
  // XVI
  ['chillan', 'XVI'],
  ['nuble', 'XVI'],
  // IX
  ['padre las casas', 'IX'],
  ['villarrica', 'IX'],
  ['araucania', 'IX'],
  ['temuco', 'IX'],
  ['angol', 'IX'],
  // II
  ['antofagasta', 'II'],
  ['tocopilla', 'II'],
  ['mejillones', 'II'],
  ['calama', 'II'],
  // IV
  ['la serena', 'IV'],
  ['coquimbo', 'IV'],
  ['ovalle', 'IV'],
  ['illapel', 'IV'],
  // VI
  ['san fernando', 'VI'],
  ['rancagua', 'VI'],
  ['machali', 'VI'],
  ['ohiggins', 'VI'],
  ['libertador', 'VI'],
  // VII
  ['constitucion', 'VII'],
  ['linares', 'VII'],
  ['curico', 'VII'],
  ['talca', 'VII'],
  ['maule', 'VII'],
  // X
  ['puerto montt', 'X'],
  ['puerto varas', 'X'],
  ['los lagos', 'X'],
  ['castro', 'X'],
  ['osorno', 'X'],
  ['calbuco', 'X'],
  // XIV
  ['panguipulli', 'XIV'],
  ['la union', 'XIV'],
  ['los rios', 'XIV'],
  ['valdivia', 'XIV'],
  // I
  ['pozo almonte', 'I'],
  ['alto hospicio', 'I'],
  ['tarapaca', 'I'],
  ['iquique', 'I'],
  // XV
  ['arica', 'XV'],
  ['putre', 'XV'],
  // III
  ['diego de almagro', 'III'],
  ['copiapo', 'III'],
  ['vallenar', 'III'],
  ['atacama', 'III'],
  // XII
  ['puerto natales', 'XII'],
  ['punta arenas', 'XII'],
  ['porvenir', 'XII'],
  ['magallanes', 'XII'],
  // XI
  ['puerto aysen', 'XI'],
  ['coihaique', 'XI'],
  ['coyhaique', 'XI'],
  ['cochrane', 'XI'],
  ['aysen', 'XI'],
  // Nombres "Región …" explícitos (orden irrelevante; se ordena por longitud)
  ['region metropolitana de santiago', 'RM'],
  ['region del libertador general bernardo ohiggins', 'VI'],
  ['region del libertador bernardo ohiggins', 'VI'],
  ['region de valparaiso', 'V'],
  ['region de los lagos', 'X'],
  ['region de los rios', 'XIV'],
  ['region de la araucania', 'IX'],
  ['region de tarapaca', 'I'],
  ['region de antofagasta', 'II'],
  ['region de atacama', 'III'],
  ['region de coquimbo', 'IV'],
  ['region del maule', 'VII'],
  ['region del biobio', 'VIII'],
  ['region de nuble', 'XVI'],
  ['region de magallanes', 'XII'],
  ['region de aysen', 'XI'],
  ['region de arica y parinacota', 'XV'],
  ['region de arica', 'XV'],
]

function buildSortedPairs(): [string, string][] {
  const out: [string, string][] = []
  const seenKw = new Set<string>()
  for (const [k, r] of KEYWORD_REGION_RAW) {
    const nk = norm(k).trim()
    if (nk.length < 2 || seenKw.has(nk)) continue
    seenKw.add(nk)
    out.push([nk, r])
  }
  out.sort((a, b) => b[0].length - a[0].length)
  return out
}

const SORTED_PAIRS = buildSortedPairs()

/** Texto normalizado igual al token (sin substrings dentro de otras cadenas). */
const LONE_REGION_TOKEN: Record<string, string> = {
  xv: 'XV',
  xvi: 'XVI',
  xiv: 'XIV',
  viii: 'VIII',
  xii: 'XII',
  xi: 'XI',
  ix: 'IX',
  vii: 'VII',
  vi: 'VI',
  iv: 'IV',
  v: 'V',
  rm: 'RM',
  iii: 'III',
  ii: 'II',
}

export function inferRegionFromText(text: string): string | null {
  const n = norm(text).replace(/\s+/g, ' ').trim()
  if (n.length < 2) return null

  for (const [kw, code] of SORTED_PAIRS) {
    if (n.includes(kw)) return code
  }

  const compact = n.replace(/\s/g, '')
  const lone = LONE_REGION_TOKEN[compact]
  if (lone) return lone

  return null
}
