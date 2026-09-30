import { Redirect, Tabs } from 'expo-router';
import { Compass, House, Map as MapIcon, MessageCircle, User } from 'lucide-react-native';

import { GlassTabBar } from '@/components/ui/GlassTabBar';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme/useTheme';

/** Barra inferior flotante de vidrio con 5 pestañas. */
export default function TabsLayout() {
  const { colors } = useTheme();
  const onboarded = useAppStore((state) => state.onboarding.completed);
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <House color={color} size={size} strokeWidth={ICON_STROKE} /> }}
      />
      <Tabs.Screen
        name="missions"
        options={{ title: 'Misiones', tabBarIcon: ({ color, size }) => <MapIcon color={color} size={size} strokeWidth={ICON_STROKE} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Chat', tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} strokeWidth={ICON_STROKE} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explorar', tabBarIcon: ({ color, size }) => <Compass color={color} size={size} strokeWidth={ICON_STROKE} /> }}
      />
      <Tabs.Screen
        name="me"
        options={{ title: 'Mi', tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={ICON_STROKE} /> }}
      />
    </Tabs>
  );
}
