import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const inTabs = segments[0] === '(tabs)';
    if (!isLoggedIn && inTabs) {
      router.replace('/login');
    } else if (isLoggedIn && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, mounted]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
        <AuthGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
