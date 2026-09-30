# SUPER PROMPT — VIRA: app móvil de resiliencia gamificada (tipo Duolingo) con la mascota REGI

> Eres Claude Code y trabajas directamente en la terminal (Git Bash, Windows) dentro del repo
> `C:\Users\Usuario\Desktop\VIRAAPP` (remoto: https://github.com/EmirDQF/Viraapp).
> Tienes permiso para crear, editar y borrar código del repo, instalar dependencias y hacer commits.
> Tu objetivo: convertir la app actual "TENAZ" en **VIRA**, una app móvil (Android/iOS con Expo) de primer nivel,
> con dinámicas tipo Duolingo, la mascota **Regi** y todas las pantallas de las imágenes de referencia.
> Trabaja por fases, verifica cada fase y no te detengas hasta terminar todas, salvo que se cumpla una de las
> condiciones de la sección "Cuándo detenerte y preguntar".

---

## 0. Cómo trabajar (léelo primero)

1. **Planifica antes de programar.** Entra en plan mode, lee TODAS las fuentes de la sección 1 y escribe `docs/PLAN.md`
   con las fases, los archivos que vas a crear/tocar y los riesgos. Usa el agente `ecc:planner` si lo tienes disponible.
2. **Rama:** `git checkout -b feat/vira-super-app`. Un commit por fase, con Conventional Commits en español
   (`feat: ...`, `fix: ...`, `chore: ...`, `test: ...`).
3. **Puerta de calidad al cierre de CADA fase** (no avances si falla):
   ```bash
   npx tsc --noEmit
   npx expo lint
   npx jest
   ```
   Si `expo lint` no tiene configuración, deja que la genere y haz commit de ella.
4. **Expo cambia en cada SDK.** El proyecto usa `expo ~57`. Antes de usar cualquier API de Expo/RN, consulta
   `https://docs.expo.dev/versions/v57.0.0/` y `https://docs.expo.dev/llms.txt`. No programes de memoria.
   Instala SIEMPRE con `npx expo install <paquete>` (nunca `npm install` directo para libs de runtime).
5. **Prefiere módulos oficiales de Expo** (expo-notifications, expo-image-picker, expo-calendar, expo-audio,
   expo-haptics, expo-linear-gradient, expo-image) antes que librerías de terceros.
6. **No crees ni edites `ios/` ni `android/`** (Continuous Native Generation). Configura permisos y plugins en `app.json`.
7. **Hook GateGuard:** si un hook te pide "presentar hechos" antes de un comando Bash, respóndelo en una o dos líneas
   (qué pide el usuario y qué verifica el comando) y reintenta. No lo desactives.
8. **Reglas de código (ECC):** archivos de 200 a 400 líneas (máximo 800), funciones de menos de 50 líneas, sin
   `console.log`, inmutabilidad (usa copias, no mutes estado), manejo explícito de errores, sin secretos en el código
   y colores solo desde `theme/tokens.ts` o constantes de ilustración (`REGI`, `LOGO`).
9. **Revisión:** al final de las fases 3, 6 y 9 lanza en paralelo `ecc:react-reviewer` y `ecc:typescript-reviewer`
   (y `ecc:security-reviewer` en la fase del chat) y corrige todo lo CRITICAL/HIGH.
10. **Verificación visual real:** usa `npx expo start --web` y compara cada pantalla con su imagen de referencia
    (viewport móvil 390×844). Ajusta hasta que se parezcan. Si hay emulador Android disponible, pruébalo ahí también.

---

## 1. Fuentes de verdad (léelas completas antes de escribir código)

| Fuente | Qué contiene |
|---|---|
| `datos/LOGO.docx` | Descomprímelo: `mkdir -p docs/brand && unzip -o datos/LOGO.docx "word/media/*" -d /tmp/vira-docx && cp /tmp/vira-docx/word/media/* docs/brand/`. Mira cada imagen. |
| `docs/brand/image1.png` | Concepto VIRA: app de acompañamiento educativo para jóvenes de **18 a 25 años**; "adaptación acompañada"; **no sustituye la atención profesional**. |
| `docs/brand/image2.png` | **Guía de identidad**: paleta, dirección visual (mascota simple y redondeada, estilo limpio/cálido, movimiento suave sin excesos), frase **"Nuevas formas de seguir"**. |
| `docs/brand/image3.png` | **Logo VIRA**: ajolote blanco estilizado en curva, con hojas coral y salvia sobre azul petróleo, y el wordmark "VIRA". |
| `docs/brand/image5.png` | **Boceto del Inicio**: logo arriba, mascota dentro de un **arco de progreso**, botón **INICIAR**, barra inferior con pestañas. |
| `docs/brand/image6.png` | **Las 4 poses de Regi** (referencia principal de la mascota). |
| `docs/brand/image4.png` e `image7.png` | Dos definiciones de la barra inferior. Se unifican en la sección 5. |
| `IMAGENES DE COMO SE DEBERIA VER LA APP/1..9.jpg.jpeg` | Maquetas de las pantallas (ver sección 6). Son de 1536×2752: redúcelas antes de verlas si hace falta. |
| `ejemplo de los aparatdo que van a las imagenes/JUEGO MODULO RESILIENCIA.html` | **Guía del juego v2**: 4 sectores, 6 módulos, 13 etapas por módulo, 10 mecánicas y **el contenido real de cada módulo en su `<script>`**. Extrae ese contenido a datos tipados. |
| Código actual: `app/`, `components/`, `data/`, `lib/`, `store/`, `theme/`, `types/` | Base existente (Expo Router, reanimated, svg, zustand, AsyncStorage, jest). Reutiliza lo que sirva. |

---

## 2. Identidad de marca VIRA

### 2.1 Paleta (`theme/tokens.ts`)
| Token | Hex | Uso |
|---|---|---|
| `petrol` | `#24576A` | primary: calma y confianza |
| `sage` | `#A8C8B5` | secondary: crecimiento |
| `coral` | `#E99479` | accent: siguiente acción, CTA |
| `ivory` | `#F8F6F0` | fondo claro |
| `ink` | `#24343B` | texto |

- Genera variantes `*Deep` (~15 % más oscuras) para la sombra de los botones 3D estilo Duolingo.
- Modo oscuro: fondo petrol profundo (~`#122A33`), superficies `#1B3B47`, texto ivory.
- Verifica **contraste WCAG AA** (≥4.5:1 en texto normal). Si coral con texto blanco no llega, usa texto `ink` sobre coral
  u oscurece el coral solo en el botón. Documenta el ajuste en un comentario.
- Conserva `victory`/`retry` (verde/rojo) para el feedback de acierto/error.
- **Color por módulo:** cada módulo tiene su propio color (el de su gajo en el dial, imagen 2). El "chrome" de la app
  (tabs, headers, fondos) usa la paleta VIRA.
- Tipografía: una sans redondeada y cálida (p. ej. Nunito o Quicksand vía `@expo-google-fonts/*` + `expo-font`);
  títulos en peso 800, texto en 400/600. Crea escalas en `typography`.

### 2.2 Renombrar TENAZ → VIRA (solo lo que ve el usuario)
- Busca con `grep -rn "TENAZ" app components data lib` y cambia cada texto visible a "VIRA". `app.json` → `expo.name: "VIRA"`.
- ⚠️ **NO cambies** `name: 'tenaz-resilience-store'` en `store/useResilienceStore.ts`, porque borraría el progreso
  guardado. Si cambias la forma del store, sube `version` y escribe una función `migrate`. Tampoco cambies `slug`
  ni `scheme` en `app.json`. Deja un comentario explicando por qué se conservan.
- Edad objetivo: ajusta `MAX_AGE` en `lib/age.ts` de 40 a **25** (la guía indica 18-25) y actualiza sus tests.
  Si prefieres no bloquear a mayores de 25, muéstrales un aviso en vez de rechazarlos, pero documenta la decisión.

### 2.3 Logo (`components/brand/ViraLogo.tsx`)
- SVG fiel a `image3`: ajolote blanco estilizado en forma de "S", 3-4 hojas/branquias en coral y salvia, fondo
  redondeado petrol y wordmark "VIRA" geométrico con letterSpacing amplio.
- Props: `size`, `variant: 'full' | 'mark'`, `tone: 'onDark' | 'onLight'`.
- **Íconos:** crea `scripts/generate-icons.mjs` que rasterice el logo con `@resvg/resvg-js` (devDependency) y genere
  `assets/icon.png` (1024), `android-icon-foreground.png` (símbolo en el 66 % central, transparente),
  `android-icon-background.png` (petrol), `android-icon-monochrome.png` (blanco), `splash-icon.png` y `favicon.png` (48).
  Actualiza `adaptiveIcon.backgroundColor` y el splash a `#24576A` en `app.json`.

---

## 3. Mascota REGI (reemplaza a "Axo")

Regi es un ajolote cuyo nombre viene de **regenerar**: representa renovar la manera de afrontar las dificultades.

### 3.1 Componente `components/regi/` (varios archivos pequeños)
- `RegiMascot.tsx` (exporta `RegiMascot`, `RegiSays`) y partes SVG: `Gills.tsx`, `Body.tsx`, `Face.tsx`, `Hands.tsx`,
  `Leaf.tsx`, `Extras.tsx`. `viewBox 0 0 200 200` con `react-native-svg`.
- Diseño fiel a `image6`: chibi de cuerpo completo, cabeza grande redonda, cuerpo pequeño sentado, cola larga curvada.
- Constante `REGI` con los colores: cuerpo lila `#C9C6F0`, sombra `#A7A2DE`, panza `#E4E2FA`, branquias rosa `#EE8FA6`
  con puntas `#F6B6C4` (3 por lado, en forma de **fronda/pluma**, no elipses), mejillas `#F4A7B9` con opacidad 0.6,
  ojos/boca `#3A3558` con brillo blanco, hoja verde `#7CC47F` con nervio `#5AA35E` y halo `#BFE8B0` (opacidad 0.3).
- Pocos rasgos, expresiones **sutiles**. Elimina la grieta dorada "kintsugi" del diseño anterior.

### 3.2 Poses (`RegiPose`)
| Pose | Referencia | Rasgos | Cuándo se usa |
|---|---|---|---|
| `calm` | Modelo base, calmado | ojos abiertos con brillo, sonrisa suave, hoja con ambas manos | por defecto, carga, onboarding, preguntas |
| `empathetic` | Modelo empático | cejas hacia arriba, ojos entrecerrados, halo rosado y 2 corazones pequeños | pausas de reflexión, error, días difíciles, chat sensible |
| `growth` | Nutrición de crecimiento | boca abierta feliz, una mano con hoja y otra con un brote | victoria, subir de nivel, racha, cofre |
| `resilient` | Apoyo resiliente | sonrisa leve, brazo extendido ofreciendo una hoja brillante, cola levantada | insights, tarjetas de aprendizaje, "Rewind" |

Además, un estado **visual dinámico** (espejo emocional, imagen 3): prop `glow: number` de -1 a 1. En negativo, Regi se
desatura y aparece un contorno tenso gris; en positivo, brilla con un halo del **color del módulo**. Se usa dentro de
los juegos: "el avatar se tensa con las malas decisiones y brilla con las buenas".

### 3.3 Animación y accesibilidad
- Respiración lenta (translateY 0 → -3, 1600 ms, ease-in-out, infinita) y pulso leve del halo. `growth`: balanceo de ±3°.
- Nada de saltos grandes ni sparkles excesivos (lo pide la guía). Respeta `useReducedMotion()` de reanimated.
- Cancela las animaciones en el cleanup del `useEffect`.
- `accessibilityRole="image"` y `accessibilityLabel="Regi, el ajolote guía, <estado>"` en español.
- Mueve etiquetas y listas de poses a `lib/regi.ts` (función pura) con su test.

### 3.4 Migración
Sustituye todos los usos de `AxoMascot`/`AxoSays` (en `_layout`, `index`, `modules/*`, `select-crucible`, `action-plan`,
`InsightStep`, `ReflectionPause`, `VictoryModal`, `BreathingStep`) con este mapeo: neutral→calm, thinking→calm
(→resilient en InsightStep), supportive→empathetic, celebrating→growth. Cambia los textos: "Soy Regi, un ajolote.
Mi nombre viene de regenerar: mi especie se recupera de lo que pierde. Te acompaño a encontrar nuevas formas de seguir."
y "Respira con Regi…". Borra `AxoMascot.tsx`. Criterio: `grep -rni "axo" app components lib data store` sin resultados
(excepto la palabra "ajolote").

---

## 4. Arquitectura

- Mueve las rutas a **`src/app/`** (lo pide AGENTS.md) con `git mv`, y el resto a `src/components`, `src/features/<feature>`,
  `src/lib`, `src/store`, `src/theme`, `src/data`, `src/types`. Ajusta `tsconfig` paths (`@/*` → `src/*`) y jest.
  Hazlo en una fase propia y con commit aparte, verificando que todo compile antes de seguir.
- Organiza por feature: `features/game`, `features/chat`, `features/impulses`, `features/evidence`, `features/support`,
  `features/progress`, `features/onboarding`, `features/profile`.
- **Estado:** zustand + persist con AsyncStorage, dividido en slices (`user`, `progress`, `gamification`, `impulses`,
  `evidence`, `contacts`, `chat`, `settings`). Store versionado con `migrate` y la clave antigua conservada.
- **Datos tipados:** los módulos del juego en `src/data/modules/*.ts` con tipos estrictos (sin `any`) y validados con
  `zod` al cargarlos.
- **Todo local y privado por defecto:** los datos del usuario no salen del teléfono, salvo el chat de IA (sección 7.4).

---

## 5. Navegación (Expo Router)

Las dos definiciones de la barra inferior (image4, image7) y el boceto (image5) se unifican en **5 pestañas**
(`src/app/(tabs)/_layout.tsx`), con íconos de `lucide-react-native` y la pestaña activa en petrol:

| Pestaña | Contenido |
|---|---|
| **Inicio** | Logo VIRA arriba, Regi dentro de un **arco de progreso** (cuánto falta para desbloquear el siguiente tema), botón grande **INICIAR** (retoma la misión donde te quedaste), **dial de módulos** (imagen 2) para elegir qué habilidad trabajar, racha y meta diaria. Acceso rápido a **Impulsos**. |
| **Misiones** | **Camino tipo Duolingo** (imagen 4, "El Recorrido"): nodos por módulo y etapa, candados, estrellas, cofres; se puede volver a un tema y rejugarlo. |
| **Chat** | Chat con Regi IA (imagen 5), con el botón fijo **"Borrón y cuenta nueva"** arriba a la izquierda. |
| **Explorar** | Explica mejor cada tema de las misiones, recomienda temas y enlaces web confiables, e incluye "Eventos y campañas cerca de ti" (participación voluntaria; datos de ejemplo hasta que exista backend). |
| **Mi** | Perfil, nivel, XP, logros, **Muro de Evidencia** (imagen 8), **Apoyo Cercano** (imagen 9), **Buzón de Impulsos** (imagen 7), estadísticas, ajustes (tema, notificaciones, reducir movimiento, borrar datos) y recursos de ayuda profesional. |

Rutas fuera de tabs: `onboarding/*`, `module/[id]`, `module/[id]/stage/[stage]`, `impulses/new`, `anchor` (pantalla
ancla), `reward`, `mirror` (espejo emocional). Usa `Link`, `router` y `useLocalSearchParams` de `expo-router`.

---

## 6. Pantallas (imita las maquetas, pero con la paleta VIRA y Regi)

| # | Imagen | Pantalla | Requisitos clave |
|---|---|---|---|
| 1 | `1.jpg` | **Onboarding "Ayúdanos a personalizar tu camino"** (paso 2/4) | 4 pasos: nombre → edad (18-25) → permisos → primer módulo. Tarjetas grandes de colores con ilustración: **Anticipar picos de estrés** (calendario + notificaciones, `expo-calendar`/`expo-notifications`), **Entender tu contexto** (noticias locales: solo explicación y enlace opcional, sin ubicación precisa), **Anclaje emocional** (fotos, `expo-image-picker`). Cada una con "PERMITIR ACCESO" y "Ahora no". Pie: "🔒 Tu privacidad es nuestra prioridad". Barra de progreso 2/4. Pide cada permiso solo al pulsar su botón y maneja el rechazo sin bloquear. |
| 2 | `2.jpg` | **Dial de módulos "Mente Resiliente"** (en Inicio) | Ruleta con gajos de colores e ícono por módulo: Hoy en Fácil, Freno de Mano, El Descarga, Enfriador de Dopamina, Muro de Evidencia, Círculo Ancla. Gira con gesto (`react-native-gesture-handler` + reanimated) y encaja en el gajo seleccionado, que queda marcado arriba con brillo. Los módulos bloqueados llevan candado. Debajo, una tarjeta con el nombre y la descripción del módulo y el botón **COMENZAR SESIÓN** (degradado). Haptics al cambiar de gajo. |
| 3 | `3.jpg` | **Espejo emocional** | Pantalla partida: "Reacción impulsiva" frente a "Respuesta resiliente", con Regi tenso (desaturado) y Regi brillante, cada uno con un medidor circular animado (% de impulsividad y % de buena decisión). Se muestra al terminar una etapa de decisión para reflejar la elección del usuario. |
| 4 | `4.jpg` | **El Recorrido / recompensa** | Encabezado "¡Tu progreso es increíble! Nivel N completado", línea de 9 insignias por nivel, Regi `growth` en un globo que dice "¡Aquí tienes tu llave dorada!", cofre animado que se abre, confeti y botón **RECOGER RECOMPENSA**. |
| 5 | `5.jpg` | **Chat con Regi IA** | Ver sección 7.4. Animación de "reinicio" al pulsar Borrón y cuenta nueva: los mensajes se difuminan y aparece "Un mal día no te define · Reiniciando para un nuevo comienzo…". |
| 6 | `6.jpg` | **Pantalla Ancla (10 segundos)** | Foto feliz elegida por el usuario a pantalla completa, anillo de cuenta regresiva de 10 s y la pregunta "¿Qué momento feliz te ancla hoy?". **Nota:** no se puede reemplazar la pantalla de bloqueo real; impleméntala como pantalla in-app que se abre desde una notificación local y desde el módulo Círculo Ancla. |
| 7 | `7.jpg` | **Buzón de Impulsos** | "+ AÑADIR IMPULSO" (ej.: comprar algo online, scrollear redes, picar comida) con **temporizador personalizado** en anillo. Botones "Esperar" y "Descartar". Al vencer, notificación local "¿Aún lo necesitas? Sí / No". Pestañas internas: Inbox, Historial, Estadísticas. Cada impulso resistido suma XP y evidencia. |
| 8 | `8.jpg` | **Muro de Evidencia** | "Tus victorias sobre momentos difíciles", contador "N crisis superadas", "+ AÑADIR LOGRO", cuadrícula de tarjetas con ícono, título y fecha. Se llena solo con los logros del juego y también a mano. Paleta dorada solo en esta pantalla. |
| 9 | `9.jpg` | **Apoyo Cercano** | "Tus contactos de confianza están aquí para ti": hasta 3 contactos (del teléfono con `expo-contacts` o a mano) y el botón **Enviar alerta rápida**, que abre un SMS/WhatsApp **ya redactado** para que el usuario lo envíe él mismo (nunca envío automático). Incluye siempre el enlace a líneas de ayuda en crisis. |

Estilo general: tarjetas redondeadas (radio 20-24), sombras suaves, **botones 3D con "hundimiento" al pulsar** (como
Duolingo; reutiliza/mejora `Button3D`), mucho espacio, ilustraciones simples y transiciones suaves.

---

## 7. El juego (corazón de la app, dinámica Duolingo)

### 7.1 Estructura (según el HTML)
- **6 módulos**: Hoy en Fácil, Freno de Mano, El Descarga, Enfriador de Dopamina, Muro de Evidencia, Círculo Ancla.
  Extrae casos, preguntas, palabras y textos del `<script>` del HTML a `src/data/modules/<id>.ts`. **"Borrón y cuenta
  nueva" ya no es un módulo**: es el botón fijo del chat.
- Integra el contenido actual (`data/modules.ts`, `data/crucibles/*`, `data/distortions.ts`) donde encaje, sin perderlo.
- **13 etapas por módulo**, agrupadas en **4 sectores**:
  1. **Descubrir**: Video contexto → Ronda 1 de preguntas → Rompecabezas
  2. **Practicar**: Swipe → Lluvia de palabras → Simulador → Ronda 2 de preguntas
  3. **Aplicar**: Video conflicto → Ronda 3 de preguntas (la que se puede recortar) → Pupiletras → Caso trampa
  4. **Dominar**: Boss contrarreloj → Rewind

### 7.2 Las 10 mecánicas (`src/features/game/mechanics/`, un componente por mecánica, reutilizable entre módulos)
1. **Video interactivo / decisión**: escena ilustrada (o video con `expo-video` si hay asset) + opciones A/B. Cada opción
   muestra su resultado y una **tarjeta de aprendizaje**. Si la elección es mala, se puede volver a elegir. Actualiza el `glow` de Regi.
2. **Rompecabezas causa/efecto**: arrastrar y ordenar la cadena (p. ej. acumulación → rumiación → agotamiento).
3. **Swipe**: tarjeta que se desliza a izquierda o derecha (reanimated + gesture-handler), con rotación y feedback.
4. **Ronda de preguntas**: unas **10 preguntas** de opción múltiple por ronda, con barra de progreso y feedback inmediato.
5. **Lluvia de palabras**: 16 palabras cayendo (8 buenas, 8 malas) durante ~45 s. Se atrapan las buenas y se esquivan las malas.
6. **Simulador de interfaz**: mini-simulación (p. ej. anotar un impulso, temporizador 20:00, "¿Aún lo necesitas?").
7. **Caso trampa**: debate con la IA. El usuario refuta una creencia ("Pedir ayuda me convierte en una carga") y la IA
   repregunta. Sin conexión, usa un árbol de respuestas guionizadas.
8. **Pupiletras**: cuadrícula 10×10 con 6 palabras y pistas, sin tiempo límite, selección arrastrando. El generador va
   en `lib/wordsearch.ts` con tests.
9. **Boss contrarreloj**: clasificar rápido (Bajo control / Fuera de control) con reloj.
10. **Rewind**: resumen del módulo, Regi brilla con el color del módulo, cofre y pase al siguiente.

### 7.3 Gamificación (lógica pura en `src/lib/gamification/*.ts`, con tests)
- **XP** por etapa (bonus por acierto a la primera y por combo), **niveles** con curva progresiva y **racha diaria**
  (reutiliza `lib/streak.ts`), **meta diaria** configurable (5/10/15 min), **cofres** y la **llave dorada** al completar
  un nivel, e **insignias** por módulo.
- **Sin vidas ni castigos.** Es una app de bienestar: equivocarse muestra una explicación empática (Regi `empathetic`)
  y permite reintentar. Nunca uses lenguaje clínico ni culpabilizador.
- Desbloqueo secuencial de etapas y módulos. El botón **INICIAR** lleva a la siguiente etapa pendiente.
- Micro-feedback: `expo-haptics` (acierto/error/selección), sonidos cortos opcionales con `expo-audio` (con interruptor
  en ajustes), confeti en victorias (reutiliza `Confetti`) y barra de progreso animada.
- **Notificaciones locales** (`expo-notifications`): recordatorio diario a la hora elegida, aviso de racha en riesgo,
  fin de temporizador de impulsos y ancla. Siempre opcionales.

### 7.4 Chat con IA (Regi)
- Pantalla tipo mensajería con burbujas, avatar de Regi, indicador "escribiendo…", input con envío y botón fijo
  **"Borrón y cuenta nueva"** que vacía la conversación con la animación de la imagen 5.
- **Seguridad de la clave:** NUNCA pongas una API key en la app. Crea una ruta de servidor de Expo Router
  (`src/app/api/chat+api.ts`; confirma en la documentación de v57 cómo se habilita la salida de servidor) que llame a la
  API de Claude con `@anthropic-ai/sdk`, leyendo `ANTHROPIC_API_KEY` de variables de entorno del servidor. Crea
  `.env.example` sin valores reales y asegúrate de que `.env` esté en `.gitignore`. Modelo: `claude-sonnet-5`
  (o `claude-haiku-4-5` si se prioriza el costo), con respuesta en streaming.
- **System prompt de Regi:** tono cálido, breve, en español neutro, para jóvenes de 18 a 25. Guía con preguntas
  (comprender la situación, reconocer recursos y apoyos, elegir un siguiente paso). No diagnostica, no da consejo médico
  y recuerda que no sustituye la atención profesional.
- **Protocolo de crisis:** si el usuario menciona autolesión o suicidio, responde con contención y muestra de inmediato
  una tarjeta con líneas de ayuda y el botón de Apoyo Cercano. Los números de emergencia van en `src/data/helplines.ts`,
  editables, con Perú por defecto (Línea 113 opción 5 y emergencias 106/105). Verifica los números con una fuente oficial
  y déjalos documentados. Aplica rate limiting básico en la ruta API y valida la entrada con zod.
- **Sin backend configurado:** modo offline con respuestas guionizadas de Regi, con un aviso discreto.

---

## 8. Calidad "app top"

- **Rendimiento:** listas con `FlatList` o `FlashList`, `React.memo` y `useCallback` donde haga falta, animaciones en el
  hilo UI (worklets), imágenes con `expo-image` y 60 fps en un Android medio.
- **Accesibilidad:** todos los táctiles con `accessibilityRole` y `accessibilityLabel` en español, objetivos de al menos
  44×44, soporte de tamaño de fuente del sistema, contraste AA y reducir movimiento.
- **Estados:** vacío, cargando y error en cada pantalla, siempre con Regi y un texto amable.
- **Modo claro y oscuro** completos.
- **Privacidad:** "Borrar mis datos" en ajustes y pantalla "Sobre VIRA" con el descargo profesional.
- **Tests:** unitarios de toda la lógica (`lib/`, gamificación, generador de pupiletras, validación, migración del store),
  con cobertura ≥80 % en `src/lib`, y tests de componentes clave con `@testing-library/react-native` (botón 3D, ronda de
  preguntas, swipe). Escribe los tests ANTES de la lógica (TDD).
- **E2E (opcional):** si se puede, un flujo en Maestro (`.maestro/`) de onboarding → primera etapa → recompensa.

---

## 9. Fases (commit y puerta de calidad al final de cada una)

| Fase | Entrega |
|---|---|
| 0 | `docs/PLAN.md`, rama y extracción de `docs/brand/`. |
| 1 | Reestructurar a `src/` + alias `@/`. Todo sigue funcionando. |
| 2 | Tokens VIRA, tipografía, `Button3D` y componentes base (Card, ProgressRing, ProgressArc, Badge, Sheet). |
| 3 | **Regi** (4 poses + glow) y **logo VIRA**, migración de Axo y renombre TENAZ → VIRA. Revisión con agentes. |
| 4 | Navegación de 5 pestañas y pantalla **Inicio** (boceto + dial). |
| 5 | Onboarding de 4 pasos con permisos. |
| 6 | **Motor del juego**: datos de los 6 módulos, 13 etapas, las 10 mecánicas, gamificación, Espejo emocional y Recorrido/recompensa. Revisión con agentes. |
| 7 | Chat IA + Borrón y cuenta nueva + protocolo de crisis (con revisión de seguridad). |
| 8 | Impulsos, Pantalla Ancla, Muro de Evidencia, Apoyo Cercano y notificaciones. |
| 9 | Explorar, perfil y ajustes, íconos, pulido de animaciones, accesibilidad, rendimiento y revisión final con agentes. |
| 10 | Verificación final (sección 10), `git push -u origin feat/vira-super-app` y PR con resumen, capturas y lista de pendientes. |

---

## 10. Criterios de aceptación finales

- [ ] `npx tsc --noEmit`, `npx expo lint` y `npx jest` en verde; cobertura ≥80 % en `src/lib`.
- [ ] `npx expo-doctor` sin errores.
- [ ] Sin "Axo" ni "TENAZ" visibles; la clave del store, el slug y el scheme se conservan, cada uno con su comentario.
- [ ] Las 9 maquetas y el boceto de Inicio reproducidos y comparados visualmente en web móvil (claro y oscuro).
- [ ] Un módulo completo jugable de principio a fin (13 etapas); los otros 5 con datos cargados y al menos el sector 1 jugable.
- [ ] Sin secretos en el repo (`git grep -i "sk-ant"` vacío); `.env.example` presente.
- [ ] Sin `console.log`; sin colores sueltos fuera de tokens o constantes de ilustración.
- [ ] Guía rápida en `README.md`: cómo correr, variables de entorno, generar íconos, `eas build --profile development`.

## Cuándo detenerte y preguntar
- Si una API de Expo v57 difiere de lo que esperabas y cambia el diseño.
- Si hace falta una cuenta o credencial (API key, EAS, stores): no la inventes. Deja el hueco documentado y sigue con el modo offline.
- Antes de hacer push a `main` o de borrar datos que no sean de esta tarea.

Al terminar, entrega un resumen con: qué hiciste por fase, capturas, decisiones tomadas, pendientes y los comandos para probar en el celular.
