# Matriz narrativa — Semantic Product Architecture (v1)

## Precedencia oficial

1. **mainGoal** — intención emocional y narrativa dominante (ahorro, respaldo, exportar excedentes, etc.).
2. **propertyType** — matiz léxico, ejemplos de carga, superficie y riesgos (casa, parcela, empresa, condominio, bodega).
3. **financialProfile** — reservado; en v1 no altera el segmento (`unknown` no cambia la decisión).

`propertyType` no redefine el objetivo principal: solo ajusta el lenguaje y el contexto de chips / disclaimers.

## Objetivo × tipo de propiedad (resumen)

| mainGoal | casa | parcela | empresa | condominio | bodega |
| --- | --- | --- | --- | --- | --- |
| ahorro / `''` / `empresa`* | savings_residential | savings_rural | savings_business | condominium_efficiency | industrial_savings |
| respaldo | backup_residential | backup_rural | operational_business | condominium_backup | industrial_continuity |
| equipos_criticos | backup_residential | backup_rural | protection_business | condominium_backup | industrial_continuity |
| vender_excedente | export_residential | export_rural | export_business | export_business | export_business |

\*Objetivo `empresa` en flujo calculadora se trata como intención de eficiencia cuando el tipo es empresa o condominio (misma rama que ahorro).

## Tabla por segmento

| Segment key | Hero claim (matriz) | Hero KPI | Loading tone | CTA tone | Forbidden language | WhatsApp framing |
| --- | --- | --- | --- | --- | --- | --- |
| savings_residential | Control de gasto y menor dependencia de la red. | ahorro | hogar / techumbre / consumo | ahorro y revisión con especialista | tu negocio sigue, operación crítica, cubierta común | (copy en `narrativeEngine`: ahorro + propuesta solar) |
| savings_rural | Eficiencia en parcela o campo con referencia declarada. | ahorro | parcela / superficie / demanda en campo | ahorro en propiedad rural | preevaluación residencial, tu hogar sigue, hogar sigue | ahorro en parcela / campo |
| savings_business | Reducción de costo energético en la operación. | ahorro | negocio / cubierta útil / demanda | eficiencia empresarial | hogar, familia, tu casa, residencial | ahorro estimado + operación |
| condominium_efficiency | Ahorro y referencia en espacios comunes. | ahorro | consumo común / cubierta | comunidad y espacios comunes | hogar, tu casa | comunidad / áreas comunes |
| backup_residential | Seguridad energética en el hogar ante cortes. | autonomia_continuidad | continuidad residencial | validación de respaldo hogar | roi agresivo | hogar ante cortes |
| backup_rural | Continuidad referencial en parcela o campo. | autonomia_continuidad | campo / parcela / cargas esenciales | autonomía en propiedad | preevaluación residencial, tu hogar sigue funcionando | autonomía en propiedad rural |
| operational_business | Continuidad operacional ante cortes. | autonomia_continuidad | continuidad de negocio | evaluación operacional | hogar, familia, tu casa | negocio operativo ante cortes |
| protection_business | Protección de activos y cargas sensibles. | continuidad_critica | resiliencia comercial | protección de equipos y operación | hogar, familia | equipos críticos |
| industrial_continuity | Infraestructura crítica y continuidad referencial. | autonomia_continuidad | industrial / cubierta o estructura | diagnóstico de infraestructura | hogar, techo despejado, tu casa, familia | operación crítica / infraestructura |
| industrial_savings | Eficiencia energética en instalación industrial. | ahorro | demanda operativa / cubierta | ahorro operativo industrial | hogar, familia, tu casa | ahorro en instalación |
| condominium_backup | Áreas comunes y espacios críticos ante cortes. | autonomia_continuidad | comunidad / espacios comunes | continuidad comunal | hogar, tu casa | áreas comunes ante cortes |
| export_residential | Autoconsumo, excedentes y referencia tipo net billing. | potencial_generacion | generación / excedentes / radiación | potencial solar y excedentes | tu hogar sigue funcionando, continuidad energética, respaldo como titular, cargas críticas como claim principal | potencial de generación y excedentes |
| export_rural | Potencial de generación y excedentes en parcela o campo. | potencial_generacion | generación en parcela | evaluación de potencial solar rural | tu hogar sigue funcionando, continuidad como titular, respaldo como titular | excedentes en parcela o campo |
| export_business | Generación distribuida y valorización de excedentes. | potencial_generacion | cubierta útil / generación | evaluación comercial de generación | hogar, familia, tu casa, tu hogar sigue funcionando | generación y excedentes comerciales |
| default | Ahorro, respaldo y continuidad como preevaluación general. | ahorro | mixto | evaluación técnica genérica | (ninguno fijo) | genérico |

## Casos explícitos de producto

### Parcela + vender excedentes (`vender_excedente`)

- **Segmento:** `export_rural`.
- **Mensaje:** generación / prosumer / potencial y excedentes en **propiedad o campo**, no survivalismo residencial.
- **Evitar como titular dominante:** continuidad, respaldo o “hogar” en el bloque principal (título, claim, loading principal).

### Bodega + respaldo

- **Segmento:** `industrial_continuity`.
- **Mensaje:** infraestructura crítica, continuidad **operacional** industrial, diagnóstico de instalación.

### Empresa + ahorro

- **Segmento:** `savings_business`.
- **Mensaje:** eficiencia y **costo operativo**; sin lenguaje doméstico (hogar / familia) en el posicionamiento principal.
