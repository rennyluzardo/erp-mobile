// app/(auth)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  DefaultTheme,
} from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import { useDatabase } from '../_layout';

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const database = useDatabase();

  useEffect(() => {
    async function prepare() {
      try {
        console.log('Checking user authentication...');
        // TODO: implement real auth check
        setIsAuthenticated(false);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    if (database) {
      prepare();
    }
  }, [database]);

  useEffect(() => {
    if (appIsReady) {
      console.log('App is ready, navigating...');
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/loginScreen');
      }
    }
  }, [appIsReady, isAuthenticated, router]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaProvider>
        <Stack initialRouteName='loginScreen'>
          <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="registerScreen" options={{ headerShown: false }} />
          <Stack.Screen name="forgotPasswordScreen" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}