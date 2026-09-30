# PLAN — TENAZ → VIRA (rama `feat/vira-super-app`)

Plan de ejecución de `docs/SUPER_PROMPT_VIRA.md`. Cada fase termina con la puerta de calidad
(`npx tsc --noEmit`, `npx expo lint`, `npx jest`) y un commit Conventional en español.

## Estado de partida (auditado)

- Expo SDK 57 (`expo ~57.0.24`), RN 0.86, React 19.2, Expo Router 57, reanimated 4.5, svg 15, zustand 5, jest-expo.
- Rutas en `app/` (onboarding, select-crucible, modules, modules/[id], action-plan); mascota `AxoMascot`.
- Store `tenaz-resilience-store` v1: `user`, `activeCrucible`, `progress` por crisol, `xp`, `streak`, `energy` (vidas).
- 5 crisoles con contenido (tarjetas control/no-control, distorsiones, reencuadres, mantras, micro-retos, reglas).
- Línea base: `tsc` ✓, 38 tests ✓, **sin configuración de ESLint**.

## Decisiones

| Tema | Decisión |
|---|---|
| Orden de desbloqueo | El del HTML (sectores): El Descarga → Enfriador de Dopamina → Freno de Mano → Hoy en Fácil → Círculo Ancla → Muro de Evidencia. El dial muestra los 6. |
| Módulo 100 % jugable | **El Descarga** (13 etapas, 10 preguntas por ronda). Los otros 5 tienen datos de las 13 etapas; sus rondas se completan hasta 10 con preguntas derivadas del contenido de los crisoles. |
| Contenido heredado | Crisoles y distorsiones pasan a `src/data/legacy/` y alimentan: preguntas extra de ronda, Boss (tarjetas control/no-control) y frases ancla. |
| Vidas/energía | Se eliminan (sin castigos). La migración descarta `energy`. |
| Migración del store | La clave `tenaz-resilience-store` se conserva; `version` 1 → 2 con `migrate` (usuario, XP, racha y progreso de crisoles se preservan). |
| Edad | `MAX_AGE = 25`. A mayores de 25 **no se les bloquea**: se muestra un aviso (la app está pensada para 18–25). Menores de 18 sí se bloquean. |
| Caso trampa | Árbol guionizado offline (siempre funciona); la IA real solo en el Chat. |
| Video interactivo | Escena ilustrada con Regi (no hay assets de video). |
| Chat IA | Ruta `src/app/api/chat+api.ts` + `@anthropic-ai/sdk`, clave solo en el servidor (`ANTHROPIC_API_KEY`). Sin servidor → modo offline guionizado. |
| Alerta rápida | `expo-sms` (redacta, el usuario envía) y enlace de WhatsApp vía `Linking`. Nunca envío automático. |
| Pantalla ancla | Pantalla in-app (no se puede reemplazar el bloqueo del SO). |
| Fuente | Nunito (`@expo-google-fonts/nunito`). |

## Fases

| Fase | Entrega | Archivos principales | Riesgos |
|---|---|---|---|
| 0 | Plan, rama, `docs/brand/` | `docs/PLAN.md`, `docs/brand/*` | — |
| 1 | Mover a `src/`, alias `@/*`, ESLint | `src/**`, `tsconfig.json`, `package.json` (jest), `eslint.config.js` | Imports relativos rotos; `testMatch`/cobertura de jest |
| 2 | Tokens VIRA, tipografía, componentes base | `src/theme/*`, `src/components/ui/*` | Contraste coral/blanco (se usa `ink` sobre coral) |
| 3 | Regi + logo, migración Axo, TENAZ→VIRA, íconos | `src/components/regi/*`, `src/lib/regi.ts`, `src/components/brand/ViraLogo.tsx`, `scripts/generate-icons.mjs` | Fidelidad del SVG; `@resvg/resvg-js` en Windows |
| 4 | 5 pestañas + Inicio (arco + dial) | `src/app/(tabs)/*`, `src/features/home/*` | Gestos del dial en web |
| 5 | Onboarding de 4 pasos + permisos | `src/app/onboarding/*`, `src/features/onboarding/*`, `app.json` | Permisos no disponibles en web → manejo amable |
| 6 | Motor del juego: datos, 13 etapas, 10 mecánicas, gamificación, Espejo, Recorrido | `src/data/modules/*`, `src/features/game/**`, `src/lib/gamification/*`, `src/lib/wordsearch.ts`, store v2 | Volumen de contenido; tamaño de archivos |
| 7 | Chat IA + Borrón + crisis | `src/app/api/chat+api.ts`, `src/features/chat/*`, `src/data/helplines.ts`, `.env.example` | Salida de servidor en SDK 57; números verificados |
| 8 | Impulsos, Ancla, Muro de Evidencia, Apoyo Cercano, notificaciones | `src/features/{impulses,evidence,support}/*`, `src/lib/notifications.ts` | Notificaciones no soportadas en web |
| 9 | Explorar, Mi/ajustes, pulido, a11y, revisión con agentes | `src/app/(tabs)/{explore,me}.tsx`, `src/features/profile/*` | — |
| 10 | Verificación final, README, push y PR | `README.md` | Credenciales de GitHub |

## Estructura objetivo

```
src/
  app/          rutas: (tabs)/, onboarding/, module/[id]/..., impulses/new, anchor, reward, mirror, api/chat+api.ts
  components/   ui/ (Button3D, Card, ...), regi/, brand/
  features/     game/ chat/ impulses/ evidence/ support/ progress/ onboarding/ profile/ home/
  lib/          lógica pura + gamification/ (con tests)
  store/        zustand + slices, versionado
  theme/        tokens, typography, useTheme
  data/         modules/*.ts (zod), legacy/, helplines.ts
  types/
```

## Revisiones con agentes

Fases 3, 6 y 9: `ecc:react-reviewer` + `ecc:typescript-reviewer` en paralelo (fase 7: + `ecc:security-reviewer`).
Se corrige todo lo CRITICAL/HIGH antes del commit.
