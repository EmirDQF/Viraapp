# Pendientes tras la revisión final (bloque G)

Revisión de los bloques A a F (`99293ec..HEAD`) con tres revisores en paralelo: React, accesibilidad y seguridad.
Se corrigieron todos los hallazgos CRITICAL y HIGH confirmados. Aquí quedan los MEDIUM y LOW.

## Corregido en el bloque G

- **[HIGH · a11y] Contraste de "Lleva esto a tu vida" (Laboratorio de casos).** El texto oscuro sobre el degradado
  profundo quedaba en 3.5:1 en los módulos con texto `ink`. Ahora el degradado va hacia lo claro, igual que en la
  tarjeta de siguiente misión de Inicio (`src/features/cases/CaseScreen.tsx`).
- **[MEDIUM · rendimiento] Avatares de Regi en el chat.** Cada burbuja montaba un Regi animado completo (bucles y
  temporizador de parpadeo). Ahora usan la variante `still` (`src/features/chat/MessageBubble.tsx`).
- **expo-doctor.** 11 paquetes de Expo con versiones de parche atrasadas, alineados con `npx expo install --fix`.

## Descartado tras verificarlo

- **[HIGH · React] "La celebración de Regi se monta dos veces".** Falso positivo: `RegiEvolutionCelebration` solo se
  monta en Inicio (`HomeScreen.tsx`); Mi camino muestra solo la tarjeta de evolución.
- **Error de tipos en `src/lib/permissions.ts`.** No se reproduce: `npx tsc --noEmit` termina sin errores.

## MEDIUM

- **Líneas de ayuda solo de Perú** (`src/data/helplines.ts`). Una persona fuera de Perú vería números que no le
  sirven en una crisis. Propuesta: elegir el país según la región del dispositivo (`expo-localization`) y mostrar
  una línea internacional cuando no haya datos de ese país.
- **Grupos de chips sin rol de grupo** (`src/features/onboarding/FocusPickers.tsx`). Cada chip anuncia bien su
  estado, pero el contenedor no tiene `accessibilityRole` de grupo como la escala de intensidad o el check-in.
- **Foco visible en los campos del caso propio** (`src/features/cases/OwnCaseScreen.tsx`). Depende del borde por
  defecto del sistema; conviene un borde de más contraste al enfocar (WCAG 2.4.11).

## LOW

- **Escala de intensidad con colores de marca fijos** (`src/features/sos/IntensityScale.tsx`). `brand.coral` y
  `brand.ink` dan 6.1:1 en ambos temas, pero no pasan por los tokens del tema.
- **`accessibilityState` y `aria-checked` a la vez** en el check-in de ánimo (`src/features/home/HelpTiles.tsx`).
  Es redundante; basta con uno.
- **Test de contraste de `on` contra `deep`.** `src/theme/__tests__/tokens.test.ts` solo comprueba `on` contra
  `base`. Agregar el caso evitaría que vuelva el problema del degradado.

## Decisiones de alcance (para la presentación)

- **Recordatorio:** se reutilizó `settings.dailyReminder` (ya existía) en lugar de crear `reminderTime`.
- **Laboratorio de casos:** es una sección propia (`/cases`), no un séptimo módulo de 13 etapas. Así no se tocan el
  desbloqueo secuencial ni la ruleta de Inicio.
- **"8 ejercicios por etapa":** se cumple en las etapas de preguntas (8 o más propias por ronda), swipe (8 o más) y
  prueba final (8 o más). Las etapas de decisión, rompecabezas, pupiletras (6 palabras por la grilla de 10×10),
  simulador y rewind son, por diseño, un único ejercicio largo.
- **Chat en el APK:** sin servidor funciona en modo offline guionado. Para usar la IA hay que desplegar la API aparte
  y definir `EXPO_PUBLIC_API_ORIGIN` (el proyecto ya usaba este nombre, no `EXPO_PUBLIC_API_URL`).
