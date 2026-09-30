import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import { ArrowLeft, Heart, HeartHandshake, MessageCircle, Phone, Trash2, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { DEFAULT_HELPLINES } from '@/data/helplines';
import { goBackOrHome } from '@/features/game/navigation';
import { haptic } from '@/lib/haptics';
import { MAX_CONTACTS, alertMessage, normalizePhone, smsUrl, whatsappUrl, type TrustedContact } from '@/lib/support';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';

/** Tono cálido amarillo del Círculo Ancla (maqueta 9). */
const WARM = MODULE_COLORS.ancla;

async function openUrl(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}

function ContactAvatar({ contact, onRemove }: { readonly contact: TrustedContact; readonly onRemove: () => void }) {
  return (
    <View style={styles.contact}>
      <View style={[styles.avatar, { backgroundColor: WARM.soft, borderColor: WARM.deep }]}>
        <AppText variant="title" color={WARM.on}>
          {initials(contact.name)}
        </AppText>
      </View>
      <AppText variant="bodyStrong" color={WARM.on} align="center" numberOfLines={1}>
        {contact.name}
      </AppText>
      <Pressable accessibilityRole="button" accessibilityLabel={`Quitar a ${contact.name}`} onPress={onRemove} hitSlop={8} style={styles.remove}>
        <Trash2 color={WARM.on} size={16} />
      </Pressable>
    </View>
  );
}

function AddContactSheet({ visible, onClose }: { readonly visible: boolean; readonly onClose: () => void }) {
  const addContact = useAppStore((state) => state.addContact);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const valid = name.trim().length >= 2 && normalizePhone(phone).replace('+', '').length >= 6;

  const save = (contactName: string, contactPhone: string) => {
    addContact({ id: `c-${Date.now().toString(36)}`, name: contactName.trim().slice(0, 40), phone: normalizePhone(contactPhone) });
    haptic('success');
    setName('');
    setPhone('');
    onClose();
  };

  const pick = async () => {
    try {
      const { granted } = await Contacts.requestPermissionsAsync();
      if (!granted) {
        setNote('Sin acceso a tus contactos. Puedes escribir el nombre y el número a mano.');
        return;
      }
      const contact = await Contacts.presentContactPickerAsync();
      const number = contact?.phoneNumbers?.[0]?.number;
      if (contact && number) save(contact.name ?? 'Contacto', number);
    } catch {
      setNote('No pudimos abrir tus contactos. Escríbelo a mano.');
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Añadir contacto de confianza" footer={<Button3D label="Guardar" disabled={!valid} tone={{ face: WARM.base, shadow: WARM.deep, text: WARM.on }} onPress={() => save(name, phone)} />}>
      {Platform.OS !== 'web' ? <Button3D label="Elegir de mis contactos" variant="outline" onPress={() => void pick()} /> : null}
      {note ? <AppText tone="muted">{note}</AppText> : null}
      <TextInput value={name} onChangeText={setName} placeholder="Nombre (p. ej. Mamá)" accessibilityLabel="Nombre" maxLength={40} style={[styles.input, { borderColor: WARM.deep, color: WARM.on, backgroundColor: WARM.soft }]} placeholderTextColor={WARM.deep} />
      <TextInput value={phone} onChangeText={setPhone} placeholder="Teléfono con código (p. ej. +51 987 654 321)" accessibilityLabel="Teléfono" keyboardType="phone-pad" maxLength={20} style={[styles.input, { borderColor: WARM.deep, color: WARM.on, backgroundColor: WARM.soft }]} placeholderTextColor={WARM.deep} />
      <AppText variant="caption" tone="muted">Se guarda solo en tu teléfono.</AppText>
    </Sheet>
  );
}

/** Apoyo Cercano (maqueta 9): hasta 3 contactos y una alerta rápida ya redactada que envías tú. */
export function SupportScreen() {
  const contacts = useAppStore((state) => state.contacts);
  const removeContact = useAppStore((state) => state.removeContact);
  const userName = useAppStore((state) => state.user?.name ?? '');
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const message = alertMessage(userName);
  const phones = contacts.map((contact) => contact.phone);

  const sendSms = async () => {
    haptic('medium');
    try {
      if (Platform.OS !== 'web' && (await SMS.isAvailableAsync())) {
        await SMS.sendSMSAsync(phones, message);
        return;
      }
    } catch {
      // Si el compositor de SMS falla, probamos con el enlace sms: estándar.
    }
    if (!(await openUrl(smsUrl(phones, message)))) setStatus('No se pudo abrir los mensajes. Prueba con WhatsApp o llama directamente.');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: WARM.soft }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={10} style={styles.back}>
          <ArrowLeft color={WARM.on} size={24} />
        </Pressable>
        <View style={styles.titleRow}>
          <AppText variant="title" color={WARM.on} accessibilityRole="header">
            Apoyo Cercano
          </AppText>
          <Heart color={WARM.on} size={24} />
        </View>
        <AppText variant="subtitle" color={WARM.on} align="center">
          Tus contactos de confianza están aquí para ti.
        </AppText>
        <View style={styles.contacts}>
          {contacts.map((contact) => (
            <ContactAvatar key={contact.id} contact={contact} onRemove={() => removeContact(contact.id)} />
          ))}
          {contacts.length < MAX_CONTACTS ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Añadir contacto de confianza" onPress={() => setAdding(true)} style={styles.contact}>
              <View style={[styles.avatar, styles.addAvatar, { borderColor: WARM.deep }]}>
                <UserPlus color={WARM.on} size={32} />
              </View>
              <AppText variant="bodyStrong" color={WARM.on}>
                Añadir
              </AppText>
            </Pressable>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar alerta rápida por SMS a tus contactos"
          accessibilityState={{ disabled: contacts.length === 0 }}
          disabled={contacts.length === 0}
          onPress={() => void sendSms()}
          style={({ pressed }) => [styles.alert, { backgroundColor: WARM.base, borderBottomColor: WARM.deep, opacity: contacts.length === 0 ? 0.5 : 1 }, pressed && styles.pressed]}
        >
          <HeartHandshake color={WARM.on} size={44} />
          <AppText variant="title" color={WARM.on} style={styles.flex}>
            Enviar alerta rápida
          </AppText>
        </Pressable>
        <AppText color={WARM.on} align="center">
          {contacts.length === 0 ? 'Añade al menos un contacto para enviar la alerta.' : 'Se abre un mensaje ya escrito. Tú decides si lo envías.'}
        </AppText>
        <Card style={styles.preview}>
          <AppText variant="caption" tone="muted">Mensaje</AppText>
          <AppText>{message}</AppText>
        </Card>
        {contacts.map((contact) => (
          <Button3D key={contact.id} label={`WhatsApp a ${contact.name}`} variant="outline" icon={<MessageCircle color={WARM.on} size={18} />} onPress={() => void openUrl(whatsappUrl(contact.phone, message))} />
        ))}
        {status ? <AppText tone="danger">{status}</AppText> : null}
        <Card>
          <AppText variant="subtitle">Si es una emergencia</AppText>
          {DEFAULT_HELPLINES.helplines.slice(0, 2).map((line) => (
            <Pressable key={line.id} accessibilityRole="button" accessibilityLabel={`Llamar a ${line.name}, ${line.display}`} onPress={() => void openUrl(`tel:${line.phone}`)} style={styles.helpline}>
              <Phone color={WARM.deep} size={18} />
              <AppText variant="bodyStrong" style={styles.flex}>
                {line.name}
              </AppText>
              <AppText variant="bodyStrong">{line.display}</AppText>
            </Pressable>
          ))}
        </Card>
      </ScrollView>
      <AddContactSheet visible={adding} onClose={() => setAdding(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  body: { padding: spacing.lg, gap: spacing.md },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  contacts: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' },
  contact: { alignItems: 'center', gap: spacing.xs, width: 104 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  addAvatar: { borderStyle: 'dashed' },
  remove: { width: MIN_TOUCH, height: MIN_TOUCH - 12, alignItems: 'center', justifyContent: 'center' },
  alert: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.xxl, borderBottomWidth: 6 },
  pressed: { transform: [{ translateY: 3 }] },
  preview: { gap: spacing.xs },
  input: { borderWidth: 2, borderRadius: radius.lg, padding: spacing.md, fontFamily: fontFamily.semibold, fontSize: 16 },
  helpline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: MIN_TOUCH },
});
