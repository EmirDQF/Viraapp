import type { ExpoConfig } from 'expo/config';

/**
 * Configuración de Expo de VIRA. Se usa app.config.ts (en lugar de app.json) para poder documentar
 * con comentarios las decisiones que no deben cambiarse.
 */
const PETROL = '#24576A';
const PETROL_NIGHT = '#122A33';

const config: ExpoConfig = {
  name: 'VIRA',
  // Se conserva "tenaz": el slug identifica el proyecto en EAS y en las builds ya instaladas.
  // Cambiarlo crearía un proyecto nuevo y rompería las actualizaciones de quienes ya tienen la app.
  slug: 'tenaz',
  // Se conserva "tenaz": es el esquema de deep links (tenaz://). Cambiarlo rompería los enlaces
  // y notificaciones que ya apuntan a la app.
  scheme: 'tenaz',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: PETROL,
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
    // Salida "server" para habilitar las rutas de API (src/app/api/chat+api.ts) con la clave solo en el servidor.
    output: 'server',
  },
  plugins: [
    // `origin`: dónde está desplegada la API, para que la app instalada resuelva /api/chat en producción.
    ['expo-router', process.env.EXPO_PUBLIC_API_ORIGIN ? { origin: process.env.EXPO_PUBLIC_API_ORIGIN } : {}],
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: PETROL,
        image: './assets/splash-icon.png',
        imageWidth: 200,
        dark: { backgroundColor: PETROL_NIGHT, image: './assets/splash-icon.png' },
      },
    ],
    ['expo-notifications', { color: PETROL }],
    [
      'expo-image-picker',
      {
        photosPermission: 'VIRA usa tus fotos solo para que elijas momentos felices que te sirvan de ancla. Nunca salen de tu teléfono.',
        cameraPermission: false,
        microphonePermission: false,
      },
    ],
    [
      'expo-calendar',
      {
        calendarPermission: 'VIRA revisa tu calendario para anticipar días exigentes y recordarte cuidarte. Nada sale de tu teléfono.',
      },
    ],
  ],
};

export default config;
