# PROMPT — Rediseño visual 2026 de VIRA (rápido, profesional, sin romper nada)

> Eres Claude Code en la terminal (Git Bash, Windows), en `C:\Users\Usuario\Desktop\VIRAAPP`, rama `feat/vira-super-app`.
> **La app YA ESTÁ CONSTRUIDA Y FUNCIONA** (fases 0-9 commiteadas: pestañas, dial, 6 módulos, 10 mecánicas, chat,
> impulsos, ancla, muro, apoyo, explorar, perfil). `npx tsc --noEmit` está en verde.
> Tu misión en esta sesión es SOLO VISUAL: llevar TODA la interfaz a un nivel de app top de 2026 (premium, viva,
> con profundidad y movimiento), sin reconstruir pantallas ni tocar la lógica.

---

## 0. Reglas de velocidad (cómo trabajar en esta sesión)

1. **No reconstruyas nada.** Reestiliza lo que existe. Antes de crear un archivo, busca si ya hay uno que haga lo mismo
   (`src/features/**`, `src/components/**`). No crees `EmotionalMirror.tsx` si existe `MirrorView.tsx`, ni `el-descarga.ts`
   si existe `descarga.ts`.
2. **No toques** `src/lib/**`, `src/store/**`, `src/data/**`, `src/app/api/**` ni la clave `'tenaz-resilience-store'`.
   Si un cambio visual necesita un dato nuevo, calcúlalo en el componente.
3. **Sin TDD para cambios visuales** (estilos, layout, animación). Sí mantén en verde los tests que existen.
4. **Verificación ligera y frecuente:**
   - Después de cada pantalla: `npx tsc --noEmit`.
   - Al final de cada bloque (D0, D1, D2, D3): `npx jest` y `npx expo lint`. Si fallan, corrige y sigue.
5. **Sin subagentes de revisión durante el trabajo.** Solo una revisión final (sección 7).
6. **Verificación visual real por pantalla, máximo 2 iteraciones.** Con `npx expo start --web` abierto, captura a 390×844,
   compárala con su maqueta de `IMAGENES DE COMO SE DEBERIA VER LA APP/` y ajusta. Si después de 2 vueltas se ve bien, sigue.
7. **Commit por bloque** (`style: ...` / `feat(ui): ...`). No hagas push a `main`.
8. Si un hook de GateGuard te pide "presentar hechos", responde en 2 líneas y reintenta; no te detengas por eso.

---

## 1. Paleta VIRA "con más vida" (reemplaza valores en `src/theme/tokens.ts`)

Misma identidad (petróleo, salvia, coral, marfil) con más saturación y luz. Contrastes WCAG ya calculados:

### Marca
| Token | Antes | Ahora | Texto encima | Contraste |
|---|---|---|---|---|
| `petrol` | #24576A | **#16708F** | blanco | 5.6 |
| `petrolDeep` | #1F4A5A | **#0F5870** | blanco | 7.9 |
| `petrolBright` (botón en oscuro) | #2F6B80 | **#17789A** | blanco | 5.0 |
| `sage` → **menta viva** | #A8C8B5 | **#5ED3A0** (deep #3FB583) | `ink` | 8.4 |
| `coral` | #E99479 | **#FF7A59** (deep #E0593A) | `ink` | 6.1 |
| **NUEVO `lilac`** (color de Regi) | — | **#6F5FEA** (deep #5646CC, soft #ECEAFF) | blanco | 4.7 |
| `ivory` | #F8F6F0 | **#FBF8F2** | — | — |
| `ink` | #24343B | **#15262E** | sobre ivory | 14.7 |
| `textMuted` claro | #56666D | **#51656E** | sobre ivory | 5.8 |

### Modo oscuro (profundo y con color, no gris plano)
`background` **#0B2029** · `surface` **#13303C** · `surfaceAlt` **#1B3D4B** · `border` **#24505F** ·
`text` **#FBF8F2** (15.8) · `textMuted` **#9FB9C4** (8.2)

### Módulos (colores del dial, más vivos como en la maqueta 2)
| Módulo | base | on | Contraste |
|---|---|---|---|
| hoy | **#16A34A** | ink | 4.7 |
| descarga | **#2563EB** | blanco | 5.2 |
| freno | **#FF5A36** | ink | 5.0 |
| enfriador | **#7446F0** | blanco | 5.4 |
| ancla | **#F59E0B** | ink | 7.3 |
| muro | **#EAB308** | ink | 8.1 |
Genera `deep` (~15 % más oscuro) y `soft` (~12 % de opacidad sobre el fondo) para cada uno.

### Degradados (nuevo `gradients` en tokens)
- `aurora`: #16708F → #2FB8A8 → #5ED3A0 (héroes, arco de progreso, CTA principal)
- `sunrise`: #FF7A59 → #FFB547 (racha, recompensas, "COMENZAR SESIÓN")
- `regi`: #6F5FEA → #B3A8FF (chat, mascota, espejo positivo)
- `gold`: #EAB308 → #FDE68A (Muro de Evidencia, cofre, llave dorada)
- `nightSky` (fondo oscuro): #0B2029 → #102C38 con 2 manchas difusas de petrol y lilac al 20 %

**Actualiza `src/theme/__tests__/tokens.test.ts`** con los valores nuevos. No borres las comprobaciones de contraste.
Todo par texto/fondo debe seguir ≥ 4.5:1.

---

## 2. Lenguaje visual 2026 (aplícalo en todas partes)

- **Profundidad por capas:** 3 niveles de elevación (`elevation.sm/md/lg` en tokens) con sombras suaves y difusas
  (en oscuro, sombra de color + borde interior de 1px con blanco al 6-8 %). Nada de cajas planas sobre fondo plano.
- **Vidrio ("liquid glass"):** instala `expo-blur` con `npx expo install expo-blur`. Crea `GlassCard` (blur + tinte
  translúcido + borde de luz arriba) para la barra de pestañas, las cabeceras flotantes, las hojas modales y las tarjetas
  sobre degradado. Revisa en la documentación de SDK 57 si existe `expo-glass-effect` para iOS 26 y úsalo solo con
  fallback a `expo-blur`.
- **Fondos vivos:** `ScreenBackground` con degradado + 2-3 "blobs" difusos (SVG radialGradient) que se desplazan muy
  lento (20-30 s). Se desactivan con reducir movimiento.
- **Bento grid:** en Inicio y Mi, tarjetas de distintos tamaños (2×1, 1×1) con esquinas de 24-28 px.
- **Tipografía con jerarquía fuerte (Nunito):**
  - display 34/800 con letterSpacing -0.5
  - título 24/800
  - subtítulo 18/700
  - cuerpo 16/500
  - caption 13/600
  - números grandes (XP, racha, %) en 800 con `fontVariant: ['tabular-nums']`
- **Íconos en "squircles":** `IconTile` = ícono de lucide (stroke 2.25) dentro de un cuadrado redondeado con degradado
  del color de su contexto y un brillo arriba. Los íconos de los módulos se ven "3D suave" (degradado + highlight +
  sombra), como en la maqueta 2.
- **Movimiento con resortes** (`src/theme/motion.ts`): presets `spring.snappy` (damping 18, stiffness 260) y
  `spring.gentle` (damping 20, stiffness 120).
  - `AnimatedPressable` (escala 0.97 + haptic ligero) en todo lo pulsable.
  - Entrada escalonada de listas (`FadeInDown.springify()` con 40 ms entre ítems).
  - Transiciones de layout y contadores numéricos animados.
  - Todo respeta `useReduceMotion()`.
- **Estados:** skeleton con shimmer para cargas, estados vacíos con Regi y un texto amable, y errores con tono cálido.
- **Densidad:** márgenes laterales de 20, separación entre secciones de 24-32 y áreas táctiles de al menos 48.
  Que nada quede pegado ni flotando en un vacío.

---

## 3. Bloque D0 — Sistema de diseño (hazlo primero: cambia todo con poco código)

- `src/theme/tokens.ts`: paleta, `gradients`, `elevation`, `radius` (sm 12, md 18, lg 24, xl 32, pill 999) y
  `spacing` (escala de 4).
- `src/theme/typography.ts`: la escala de la sección 2.
- `src/theme/motion.ts`: presets de resorte y duraciones.
- Commit: `style: sistema de diseño VIRA 2026 (paleta viva, degradados, elevación y movimiento)`.

## 4. Bloque D1 — Componentes (`src/components/ui/`)

Reestiliza los que existen y crea solo los que faltan:
- `Button3D`: variantes `primary` (aurora), `accent` (sunrise), `secondary`, `ghost` y `danger`, con labio inferior de
  5 px del color deep que se hunde al pulsar (resorte), haptic, estado de carga y altura de 56.
- `Card`: variantes `solid`, `glass` y `gradient`.
- `ProgressArc` / `ProgressRing`: trazo con degradado, extremo redondeado, brillo (glow) y valor animado.
- `Badge` / `Chip`, `Sheet` (modal con vidrio y asa).
- **Nuevos:** `GlassCard`, `ScreenBackground`, `IconTile`, `AnimatedPressable`, `StatPill` (ícono + número; para
  racha, XP y nivel), `SectionHeader`, `Skeleton`, `EmptyState` (con Regi) y `AnimatedNumber`.
- **Barra de pestañas flotante** en `src/app/(tabs)/_layout.tsx`: cápsula de vidrio separada 12 px de los bordes,
  indicador activo animado (pastilla con degradado aurora detrás del ícono) y etiquetas de 11/700.
- Regi (`src/components/regi/`): suaviza los contornos, añade un brillo de luz en la cabeza y una sombra de contacto
  elíptica bajo los pies. El halo del `glow` usa el degradado `regi` (positivo) o se desatura (negativo). No cambies
  su API.
- Commit: `feat(ui): componentes base 2026 y barra de pestañas de vidrio`.

## 5. Bloque D2 — Pantallas principales (en este orden)

| # | Pantalla | Archivo(s) | Objetivo visual |
|---|---|---|---|
| 1 | **Inicio** | `features/home/HomeScreen.tsx`, `ModuleDial.tsx` | Cabecera con saludo y `StatPill` de racha, XP y nivel. Héroe en vidrio: logo, Regi dentro del arco de progreso aurora con glow y el botón INICIAR (aurora). Bento con Meta diaria, Buzón de impulsos y siguiente misión. **Dial como la maqueta 2:** borde metálico con brillo neón, gajos con degradado del color del módulo, íconos "3D", el gajo seleccionado se eleva con glow e indicador arriba, candados con opacidad, tarjeta inferior de vidrio con el módulo y "COMENZAR SESIÓN" (sunrise). |
| 2 | **Etapas del juego** | `features/game/StageScreen.tsx`, `ChoiceButton.tsx`, `FeedbackPanel.tsx`, `mechanics/*` | Estilo Duolingo 2026: barra de progreso gruesa con degradado del módulo y brillo; opciones como tarjetas grandes con letra en IconTile; al acertar, la opción se pone verde con check animado; al fallar, sacudida suave. El panel de feedback sube desde abajo (vidrio + color) con Regi. Unifica el layout de las 10 mecánicas para que todas se sientan de la misma familia. |
| 3 | **Espejo emocional** | `features/game/MirrorView.tsx` | Como la maqueta 3: dos columnas; la izquierda gris y tensa (Regi desaturado, anillo rojo), la derecha luminosa (Regi con glow, anillo degradado verde-lima). ⚠️ **Bug actual:** en la tarjeta "Respuesta resiliente", el texto blanco sobre verde claro no se lee (título, 85 % y descripción). Corrígelo con texto `ink` o un fondo más oscuro. |
| 4 | **Recompensa / Recorrido** | `features/game/RewardScreen.tsx`, `TreasureChest.tsx` | Como la maqueta 4: fondo cálido con confeti, "¡Tu progreso es increíble!", línea de 9 insignias con degradado, Regi `growth` con globo "¡Aquí tienes tu llave dorada!", cofre que se abre con resorte y brillo dorado, botón RECOGER RECOMPENSA. |
| 5 | **Misiones** | `features/progress/MissionsScreen.tsx`, `ModulePath.tsx`, `StageNode.tsx` | Camino serpenteante tipo Duolingo: nodos circulares 3D (color del módulo, labio inferior), el nodo actual pulsa con Regi al lado, candados suaves, cofres entre sectores y separadores de sector con el nombre (Descubrir, Practicar, Aplicar, Dominar). |

Commit: `style: Inicio, dial, juego, espejo, recompensa y misiones con diseño 2026`.

## 6. Bloque D3 — Resto de pantallas

| Pantalla | Archivo(s) | Objetivo visual (maqueta) |
|---|---|---|
| Chat | `features/chat/*` | Maqueta 5: fondo degradado `regi` suave, burbujas (usuario en petrol, Regi en vidrio), avatar de Regi, "escribiendo…" con 3 puntos animados, input en cápsula de vidrio con botón de enviar circular, botón "Borrón y cuenta nueva" como píldora de vidrio arriba a la izquierda, y la animación de reinicio con partículas que se disuelven y el texto "Un mal día no te define". |
| Impulsos | `features/impulses/*` | Maqueta 7: tarjetas con anillo de cuenta regresiva degradado, ícono del impulso en IconTile, botones Esperar/Descartar integrados abajo y "+ AÑADIR IMPULSO" como píldora. |
| Ancla | `features/support/AnchorScreen.tsx` | Maqueta 6: foto a pantalla completa con velo degradado, reloj grande, anillo coral con glow de 10 s y pregunta centrada. |
| Muro de Evidencia | `features/evidence/*` | Maqueta 8: tema dorado, cinta "N crisis superadas", cuadrícula 3-4 columnas de tarjetas con IconTile dorado y fecha, entrada escalonada. |
| Apoyo Cercano | `features/support/SupportScreen.tsx` | Maqueta 9: fondo cálido, avatares circulares grandes con borde blanco y nombre en píldora, botón grande "Enviar alerta rápida" (sunrise) y tarjeta de líneas de ayuda siempre visible. |
| Onboarding | `features/onboarding/*` | Maqueta 1: tarjetas grandes de color con ilustración en IconTile, "PERMITIR ACCESO" dentro de la tarjeta, "Ahora no" discreto, barra 1-4 con degradado. La bienvenida lleva fondo aurora con blobs, logo y Regi con entrada animada. |
| Explorar / Mi / Ajustes / Sobre VIRA | `features/explore/*`, `features/profile/*`, `features/settings/*` | Bento, IconTile, `SectionHeader`, `StatPill` y filas de menú con chevron. Coherente con todo lo anterior. |

Commit: `style: chat, impulsos, ancla, muro, apoyo, onboarding, explorar y perfil con diseño 2026`.

---

## 7. Cierre (una sola vez, al final)

1. `npx tsc --noEmit`, `npx jest` y `npx expo lint` en verde.
2. Lanza en paralelo `ecc:react-reviewer` (rendimiento de animaciones y re-renders) y `ecc:a11y-architect` (contraste,
   etiquetas, reducir movimiento). Corrige solo lo CRITICAL/HIGH.
3. Capturas finales a 390×844 en claro y oscuro de las 12 pantallas en `docs/screenshots/`.
4. Commit final y resumen: qué cambió por pantalla, capturas antes/después y pendientes.

## Criterios de "app top 2026"
- [ ] Ninguna pantalla con fondo plano sin profundidad; todas usan `ScreenBackground` o una superficie con elevación.
- [ ] Todo lo pulsable tiene respuesta física (escala + haptic); todo lo que aparece entra con resorte.
- [ ] El dial, el espejo, la recompensa y el chat se parecen claramente a sus maquetas.
- [ ] Contraste AA en claro y oscuro (sin texto blanco sobre colores claros).
- [ ] 60 fps: animaciones en worklets, blobs desactivados con reducir movimiento, sin blur anidado en listas largas.
- [ ] Sin colores hex fuera de `tokens.ts` y de las constantes de ilustración (`REGI`, `LOGO`).

**Empieza ya por el bloque D0.**
