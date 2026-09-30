/**
 * Permisos del dispositivo. Cada permiso se pide solo cuando el usuario pulsa su botón, y un rechazo o un
 * error (por ejemplo, un módulo no disponible en Expo Go o en web) nunca bloquea la app.
 */
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { PermissionKey, PermissionState } from '@/store/types';

/** Permisos que no existen en web; ahí se explica que funcionan en la app instalada. */
const NATIVE_ONLY: readonly PermissionKey[] = ['calendar', 'notifications'];

export function isPermissionSupported(key: PermissionKey): boolean {
  return Platform.OS !== 'web' || !NATIVE_ONLY.includes(key);
}

async function ask(key: PermissionKey): Promise<boolean> {
  switch (key) {
    case 'calendar':
      return (await Calendar.requestCalendarPermissions()).granted;
    case 'notifications':
      return (await Notifications.requestPermissionsAsync()).granted;
    case 'photos':
      return (await ImagePicker.requestMediaLibraryPermissionsAsync()).granted;
    case 'news':
      // Solo muestra explicaciones y enlaces opcionales: no usa la ubicación ni un permiso del sistema.
      return true;
  }
}

export async function requestPermission(key: PermissionKey): Promise<PermissionState> {
  if (!isPermissionSupported(key)) return 'denied';
  try {
    return (await ask(key)) ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}
