# SUPER PROMPT — VIRA v2.0 completa + APK descargable

> Pega TODO lo que está debajo de la línea en Claude Code (Git Bash, dentro de `~/Desktop/VIRAAPP`).
> Recomendado arrancar así para que GateGuard no frene cada paso:
> `ECC_GATEGUARD=off claude`

---

Eres el ingeniero principal de **VIRA**, una app móvil de resiliencia estilo Duolingo con la mascota **Regi** (ajolote). El repo ya existe y funciona: rama `feat/vira-super-app`, Expo SDK 57, Expo Router en `src/app/`, zustand persistido con migraciones zod (`src/store/migrations.ts`), 6 módulos × 13 etapas (`src/data/modules/`), 10 mecánicas, chat con fallback offline, protocolo de crisis Perú (`src/data/helplines.ts`), diseño 2026 aplicado, 243 tests en verde.

**OBJETIVO:** dejar la app **completa, personalizada y con ayuda real**, y entregar un **APK de Android instalable** con un link de descarga.

**NO reconstruyas nada.** Extiende lo que existe. Antes de crear un archivo, busca si ya hay uno parecido (`grep -r`) y reutilízalo.

## 0. Reglas de trabajo (versión ligera de las reglas ECC)

1. **Expo cambia mucho.** Lee la versión de `expo` en `package.json`. Antes de tocar cualquier API de Expo o EAS, consulta `https://docs.expo.dev/versions/v57.0.0/` o `https://docs.expo.dev/llms.txt`.
2. **Instala paquetes solo con `npx expo install <pkg>`.** Usa solo módulos Expo: expo-notifications, expo-haptics, etc.
3. **No edites `ios/` ni `android/` a mano (CNG).** Todo va en `app.config.ts` y en los config plugins.
4. **TDD solo para lógica:** store, migraciones, motor de recomendaciones, cronología, contenido (validación con el esquema). Para lo visual no hace falta.
5. **Verificación por bloque:**
   - Corre `npx tsc --noEmit` después de cada pantalla.
   - Al cerrar cada bloque, corre `npx jest` y `npx expo lint`.
   - Haz un commit por bloque con conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
6. **Estilo de código:**
   - Inmutable: no mutes estado.
   - Archivos de menos de 800 líneas y funciones de menos de 50.
   - Sin `console.log`.
   - Maneja todos los errores.
7. **Secretos:**
   - Nunca escribas API keys en el código ni las metas en el APK.
   - `.env` va siempre en `.gitignore`.
8. **Migraciones:** todo campo nuevo del store lleva una migración zod con valor por defecto seguro. El progreso que el usuario ya tiene **no se pierde**.
9. **Revisión:** los revisores van **solo al final** (bloque G). Si algo falla 2 veces seguidas, detente y explícame el problema. No entres en bucle.
10. **Una sola sesión:** no abras navegadores ni servidores en puertos que ya estén ocupados. Usa `--port 8084` si lo necesitas.

## 1. Contexto académico (el contenido DEBE cubrirlo)

La app es el **producto creativo** del curso *Desarrollo de Resiliencia 2026-20* (ISIL), sobre **impulsividad y técnicas de control**. Todo el contenido debe enseñar y practicar cuatro cosas:

1. **Impulsos:** qué son, tipos (agresivo, de compra, de comer, digital/redes, de abandonar, de decir algo hiriente), disparadores, la curva del impulso (sube, pico, baja).
2. **Pensamientos → emociones → reacciones:** el triángulo cognitivo. Pensamientos automáticos, distorsiones (catastrofizar, leer la mente, todo o nada, personalizar) y cómo cambian la emoción y la conducta.
3. **Frustración:** cómo se manifiesta en el cuerpo, en los pensamientos y en las conductas. La baja tolerancia a la frustración y cómo aumentarla.
4. **Técnicas de control**, cada una como ejercicio interactivo:
   - **STOP** (Para, Toma aire, Observa, Prosigue).
   - Respiración 4-7-8 y respiración cuadrada.
   - Contar hasta 10 y el tiempo fuera.
   - Surfear el impulso (urge surfing).
   - Grounding 5-4-3-2-1.
   - Reestructuración cognitiva (pensamiento → evidencia → pensamiento alternativo).
   - Autoinstrucciones.
   - Solución de problemas en 5 pasos.
   - Demora de la gratificación (la regla de los 10 minutos).
   - Relajación muscular progresiva.
   - Comunicación asertiva.

El contenido tiene base en TCC y DBT, va en español neutro-peruano, con un tono cálido, sin juzgar y sin diagnosticar. Agrega una pantalla **"Fuentes"** dentro de `about` con 5 a 8 referencias reales en formato APA. Usa solo referencias que conozcas con certeza, como Beck, Linehan, Gross o la APA. Si dudas de una, no la pongas.

## 2. Bloques de trabajo (en este orden)

### Bloque A — "Cuéntame de ti": perfil y personalización

**Onboarding nuevo** (extiende `src/app/onboarding/`). Son 5 pasos animados con Regi:

1. **Nombre o apodo.** El campo ya existe; reutilízalo.
2. **"¿Qué quieres mejorar?"** (multi-selección con chips e iconos):
   - Controlar impulsos
   - Manejar la frustración
   - Entender mis emociones
   - Ansiedad y estrés
   - Resiliencia
   - Estrategias de control
   - Pensamientos negativos
   - Relaciones y comunicación
   - Estrés académico o laboral
   - Uso del celular y redes
3. **"¿Cuándo te cuesta más?"** Opciones: mañana, tarde, noche o con ciertas personas.
4. **Meta diaria:** 5, 10 o 15 minutos. Ya existe `dailyGoalMinutes`.
5. **Hora del recordatorio:** opcional, con expo-notifications y un recordatorio local.

**Store:**
- Campos nuevos: `focusAreas: FocusArea[]`, `hardMoments: HardMoment[]` y `reminderTime: string | null`.
- Cada uno con migración zod y tests.
- Los usuarios que ya tienen datos saltan este onboarding y ven una tarjeta "Personaliza tu camino" en Inicio.

**Ruta personalizada:**
- Escribe `src/lib/personalize.ts`, una función pura con tests, que ordene los módulos y recomiende la "Lección del día" según `focusAreas`.
- Debe funcionar igual con 0 áreas o con todas.

**Editable:** desde `Mi → Ajustes → Mis objetivos`.

### Bloque B — Contenido completo: todas las preguntas y todos los temas

1. **Audita el contenido** de `src/data/modules/*`.
   - Cuenta las preguntas por etapa e imprime una tabla.
   - **Mínimo 8 ejercicios por etapa**, con las 10 mecánicas mezcladas.
   - Cada respuesta incorrecta lleva una explicación breve y amable.
2. **Cobertura de temas:**
   - Asegura que los 4 ejes de la sección 1 estén cubiertos en los 6 módulos:
     - `freno`: impulsos y STOP.
     - `enfriador`: frustración y enojo.
     - `descarga`: emociones y cuerpo.
     - `muro`: pensamientos y distorsiones.
     - `ancla`: grounding y calma.
     - `hoy`: integración diaria.
   - Si falta un tema, agrégalo como etapas nuevas. **No borres etapas existentes.**
3. **Módulo nuevo `casos`, el "Laboratorio de casos":**
   - **Qué es:** 6 a 8 casos de personajes de películas o series conocidas. Ejemplos: *Intensamente* (Riley y su enojo), *Joker* (impulsividad y frustración), *Breaking Bad*, *Coco*, *Whiplash*, *Encanto*, *El lobo de Wall Street*, *Bojack Horseman*.
   - **Formato del caso:** por cada caso, un resumen **escrito con tus propias palabras**, sin citas textuales ni guiones.
   - **Preguntas del curso:** el usuario responde, con mecánicas interactivas:
     1. ¿Qué impulsos observas?
     2. ¿Qué pensamientos, emociones y reacciones aparecen?
     3. ¿Cómo se manifiesta la frustración?
     4. ¿Qué técnica de control le ayudaría?
   - **Cierre:** Regi da retroalimentación y "Lleva esto a tu vida", un mini reto personal.
   - **Caso propio:** el usuario puede escribir su propio caso, que se guarda solo en el dispositivo.
4. **Validación:** todo pasa por `schema.ts` y hay un test que valida **todo** el catálogo (ids únicos y respuestas correctas existentes).

### Bloque C — "Mi camino": cronología del avance

1. **Pantalla nueva** `src/app/journey.tsx`, con acceso desde Inicio y desde Mi. Es una **línea de tiempo vertical**: cada día es un nodo y cada evento una tarjeta con icono y color de su módulo.
2. **Eventos que se muestran:**
   - Lección completada.
   - Impulso registrado y si se resistió.
   - Check-in de ánimo.
   - Técnica usada.
   - Racha.
   - Insignia.
   - Caso resuelto.
   - Hito ("¡Primera semana!", "10 impulsos frenados").
3. **Datos:**
   - Usa el historial que ya existe en el store. Si falta algo, agrega `timeline: TimelineEvent[]`, un append-only de 500 eventos como máximo, con migración.
   - La lógica va en `src/lib/timeline.ts` con tests: agrupar por día, detectar hitos y calcular la tendencia semanal.
4. **Arriba de la línea de tiempo:**
   - Una tarjeta resumen de la semana: minutos, impulsos frenados, ánimo promedio.
   - Un mini gráfico de 7 días hecho con react-native-svg.
   - Una frase de Regi según la tendencia.
5. **Regi evoluciona:** 4 etapas visuales según el XP total: cría, juvenil, adulto y sabio.
   - Las etapas cambian con accesorios o el tamaño del brillo.
   - Cada etapa se desbloquea con una animación de celebración.

### Bloque D — Regi vivo: movilidad y personalidad

Usa solo reanimated, react-native-svg y gesture-handler, sin assets pesados.

- **En reposo:**
  - Respiración suave (escala de 1 a 1.03).
  - Parpadeo aleatorio cada 3 a 6 segundos.
  - Branquias que ondean con un desfase entre ellas.
  - Flotación vertical de ±4 px.
- **Reacciones:**
  - **Acierto:** salto y brillo.
  - **Error:** inclina la cabeza con empatía (nunca pone cara triste exagerada).
  - **Racha:** baile corto.
  - **Al tocarlo:** se ríe y dice una frase.
  - **Al arrastrarlo:** "rebota" con gesture-handler.
- **Expresiones:** las 4 poses que ya existen (calm, empathetic, growth, resilient) pasan de una a otra con una transición suave, no con un cambio brusco.
- **Accesibilidad:**
  - Respeta `useReducedMotion()`: si está activo, Regi queda estático pero sigue expresivo.
  - Mantén 60 fps: anima solo `transform` y `opacity`, con `useSharedValue` y sin re-renders.
- **Frases contextuales:** Regi dice frases según la hora, la racha y el foco del usuario. Escribe un banco de 40 frases o más en `src/data/regiLines.ts`.

### Bloque E — Ayuda real

1. **Botón SOS "Tengo un impulso ahora"**, siempre visible en Inicio. Lleva a un flujo de 3 toques:
   1. Qué siento, con una intensidad de 1 a 10.
   2. Una técnica guiada en pantalla completa, con temporizador y haptics.
   3. "¿Cómo estás ahora?", con la intensidad otra vez.
   - Al terminar, guarda el resultado en la cronología y muestra la diferencia, por ejemplo "Bajaste de 8 a 4".
2. **Check-in diario de ánimo:** un toque con 5 caritas.
   - Si el ánimo es bajo 3 días seguidos, Regi sugiere hablar con alguien y muestra los contactos de apoyo.
3. **Recomendador:** escribe `src/lib/recommend.ts`, una función pura con tests, que tome el ánimo, los impulsos recientes, el foco y la hora, y sugiera una técnica concreta.
4. **Protocolo de crisis:**
   - Mantenlo y verifica que sea accesible desde el SOS y el chat.
   - Usa **solo** los números que ya están en `src/data/helplines.ts`. **No inventes números.**
5. **Recordatorios locales** con expo-notifications, en la hora que eligió el usuario, con un texto amable.
   - Pide el permiso solo cuando el usuario activa el recordatorio.

### Bloque F — Paleta final y pulido visual

- **Paleta:** mantén la paleta vívida de `docs/PROMPT_DISENO_2026.md` (petrol #16708F, mint #5ED3A0, coral #FF7A59, lilac #6F5FEA, ivory #FBF8F2, ink #15262E, fondo oscuro #0B2029). Ajústala solo si algún par falla el contraste WCAG AA.
- **Íconos y splash:** en `app.config.ts`, reemplaza el petrol viejo (`#24576A` y `#122A33`) del icono adaptativo y del splash por `#16708F` y `#0B2029`. Regenera los iconos con `npm run icons` (o con el script que exista).
- **Pantallas nuevas:** onboarding, journey, casos y SOS usan los mismos tokens, gradientes y componentes del sistema de diseño. No dupliques estilos.
- **Detalles:**
  - Haptics en aciertos y botones principales.
  - Skeletons en lugar de spinners.
  - Transiciones de Expo Router.
  - Modo oscuro completo.
  - Textos que escalan bien con la fuente grande del sistema.
- **Chat en el APK:** el APK no tiene servidor, así que el chat usa el **modo offline guionado** por defecto. Si existe `EXPO_PUBLIC_API_URL`, apunta a esa API, desplegada aparte con EAS Hosting. La key de Anthropic vive **solo** en el servidor.

### Bloque G — Revisión final (una sola pasada)

1. Lanza en paralelo `ecc:react-reviewer`, `ecc:a11y-architect` y `ecc:security-reviewer` sobre `git diff main...HEAD`.
2. Corrige solo los hallazgos CRITICAL y HIGH, y lista los MEDIUM en `docs/PENDIENTES.md`.
3. Al final debe quedar todo en verde: `npx tsc --noEmit`, `npx jest`, `npx expo lint` y `npx expo-doctor`.

### Bloque H — Construir el APK

1. **Configura `app.config.ts`:**
   - `android.package: 'pe.vira.app'`. Antes, confirma que no exista ya otro package configurado.
   - `version: '2.0.0'`.
   - Permisos mínimos, solo los que pide expo-notifications.
2. **Configura `eas.json`:** al perfil `preview` agrégale:
   ```json
   "preview": { "distribution": "internal", "android": { "buildType": "apk" } }
   ```
3. Haz commit y push de la rama.
4. **DETENTE y pídeme** que yo ejecute el login, porque es mi cuenta y no debes pedirme la contraseña:
   ```bash
   npx eas-cli@latest login
   ```
5. Cuando te confirme que ya inicié sesión, ejecuta:
   ```bash
   npx eas-cli@latest init
   npx eas-cli@latest build -p android --profile preview
   ```
6. **Al terminar el build:**
   - Dame el **link de descarga del APK** y el QR que entrega EAS.
   - Explícame cómo instalarlo en Android: abrir el link en el celular, permitir "instalar apps desconocidas" e instalar.
7. **Si el build falla:**
   - Lee el log con `npx eas-cli@latest build:view`.
   - Corrige con el agente `ecc:build-error-resolver` y reintenta **máximo 2 veces**.
   - Si sigue fallando, para y explícame el error.

## 3. Definición de "terminado"

- [ ] Onboarding con "¿qué quieres mejorar?", y la ruta y la lección del día personalizadas.
- [ ] Al menos 8 ejercicios por etapa, los 4 ejes del curso cubiertos y el Laboratorio de casos funcionando.
- [ ] La cronología "Mi camino" con hitos, gráfico semanal y la evolución de Regi.
- [ ] Regi animado (respira, parpadea, reacciona, se puede tocar) y respeta "reducir movimiento".
- [ ] El SOS de impulsos, el check-in de ánimo, el recomendador, los recordatorios y el protocolo de crisis funcionando.
- [ ] Iconos y splash con la paleta nueva, y el modo oscuro completo.
- [ ] tsc, jest, lint y expo-doctor en verde; el progreso viejo migra sin perderse.
- [ ] Un **APK descargado e instalado** en un Android real, con el link compartible.

Al final, entrégame un resumen corto: qué se hizo, el link del APK, cuántas preguntas y temas hay y qué quedó pendiente.

**Empieza por el Bloque A.**
