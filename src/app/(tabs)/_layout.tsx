import { Redirect, Tabs } from 'expo-router';
import { Compass, House, Map as MapIcon, MessageCircle, User } from 'lucide-react-native';

import { useAppStore } from '@/store/useAppStore';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

/** Barra inferior de 5 pestañas (unifica image4, image5 e image7 de la guía). */
export default function TabsLayout() {
  const { colors } = useTheme();
  const onboarded = useAppStore((state) => state.onboarding.completed);
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.highlight,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, minHeight: 60 },
        tabBarLabelStyle: { fontFamily: fontFamily.bold, fontSize: 12 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="missions" options={{ title: 'Misiones', tabBarIcon: ({ color, size }) => <MapIcon color={color} size={size} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explorar', tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }} />
      <Tabs.Screen name="me" options={{ title: 'Mi', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}
