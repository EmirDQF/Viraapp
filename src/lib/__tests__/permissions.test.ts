import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';

import { requestPermission } from '@/lib/permissions';

jest.mock('expo-calendar', () => ({ requestCalendarPermissions: jest.fn() }));
jest.mock('expo-image-picker', () => ({ requestMediaLibraryPermissionsAsync: jest.fn() }));
jest.mock('expo-notifications', () => ({ requestPermissionsAsync: jest.fn() }));

const mockCalendar = Calendar.requestCalendarPermissions as jest.Mock;
const mockPhotos = ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock;
const mockNotifications = Notifications.requestPermissionsAsync as jest.Mock;

describe('requestPermission', () => {
  beforeEach(() => jest.clearAllMocks());

  test('devuelve granted cuando el sistema concede el permiso', async () => {
    mockPhotos.mockResolvedValue({ granted: true });
    await expect(requestPermission('photos')).resolves.toBe('granted');
  });

  test('devuelve denied cuando el usuario lo rechaza', async () => {
    mockCalendar.mockResolvedValue({ granted: false });
    await expect(requestPermission('calendar')).resolves.toBe('denied');
  });

  test('un error del módulo nativo (p. ej. Expo Go sin soporte) no rompe el flujo', async () => {
    mockNotifications.mockRejectedValue(new Error('no disponible'));
    await expect(requestPermission('notifications')).resolves.toBe('denied');
  });

  test('las noticias locales no piden un permiso del sistema: es solo una preferencia', async () => {
    await expect(requestPermission('news')).resolves.toBe('granted');
    expect(mockCalendar).not.toHaveBeenCalled();
  });
});
