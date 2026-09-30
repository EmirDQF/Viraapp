# VIRA

Entrenamiento diario de resiliencia para jóvenes de 18 a 25 años, al estilo Duolingo, con **Regi**, el ajolote
guía. App Expo (SDK 57) con Expo Router, TypeScript y datos solo en el teléfono.

> VIRA no reemplaza la ayuda profesional. Si alguien está en peligro, llama a una línea de ayuda
> (en Perú: Línea 113 opción 5, SAMU 106).

## Guía rápida

Requisitos: Node 20 o superior y npm.

```bash
npm install
cp .env.example .env        # opcional: solo hace falta para el chat con IA
npx expo start              # abre en Expo Go, emulador o web (tecla w)
npx expo start --web        # directo en el navegador
```

Sin clave de API la app funciona completa: el chat con Regi entra en **modo sin conexión** con respuestas
preparadas y el protocolo de crisis sigue activo.

### Variables de entorno (`.env`)

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `ANTHROPIC_API_KEY` | Solo servidor (`src/app/api/chat+api.ts`) | Clave para el chat con IA. **Nunca** con prefijo `EXPO_PUBLIC_` ni dentro de la app. |
| `TRUST_PROXY_HEADERS` | Solo servidor | `true` solo detrás de un proxy de confianza que reescribe `X-Forwarded-For`. |
| `EXPO_PUBLIC_API_ORIGIN` | App (pública) | Origen donde se despliega la API (p. ej. `https://vira.example.com`) para la app instalada. |

`.env` está en `.gitignore`. En EAS, las claves van como variables de entorno de EAS, no en el repositorio.

### Calidad

```bash
npm run typecheck           # npx tsc --noEmit
npm run lint                # npx expo lint
npm test                    # npx jest (añade --coverage para ver la cobertura)
npx expo-doctor             # salud de dependencias y configuración
```

### Íconos y sonidos

Los íconos (app, adaptativo de Android, splash y favicon) se generan desde la geometría del logo en
`src/components/brand/logoGeometry.ts`; los sonidos son tonos sintetizados:

```bash
npm run icons               # escribe assets/*.png
npm run sounds              # escribe assets/sounds/*.wav
```

### Probar en el teléfono

- **Expo Go:** `npx expo start` y escanea el QR. Notificaciones, calendario y contactos tienen limitaciones en Expo Go.
- **Build de desarrollo (recomendado):** incluye todos los módulos nativos.

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform android   # o ios
npx expo start --dev-client
```

Los perfiles están en `eas.json` (`development`, `preview`, `production`). Las carpetas `ios/` y `android/` se
generan (Continuous Native Generation): no se editan a mano; la configuración nativa vive en `app.config.ts`.

## Estructura

```
src/
  app/          rutas de Expo Router (pestañas, onboarding, juego, bienestar, API del chat)
  features/     pantallas por dominio (home, game, chat, impulses, explore, profile, settings…)
  components/   UI base (Button3D, Card, ProgressRing…), Regi y logo
  lib/          lógica pura con tests (gamificación, pupiletras, crisis, notificaciones…)
  data/         contenido de los 6 módulos, etapas, líneas de ayuda y Explorar
  store/        zustand persistido (clave `tenaz-resilience-store`, versión 2) y migraciones
  theme/        tokens de color, tipografía y hooks de tema
```

Más detalle de decisiones en [`docs/PLAN.md`](docs/PLAN.md).
