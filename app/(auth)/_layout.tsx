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
import { getAuthToken, getUserId } from '../../utils/auth';

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
        
        // Check for existing auth token and user ID in secure storage
        const authToken = await getAuthToken();
        const userId = await getUserId();
        
        console.log('Auth token found:', !!authToken);
        console.log('User ID found:', !!userId);
        
        // User is authenticated if both token and user ID exist
        const isAuth = !!(authToken && userId);
        setIsAuthenticated(isAuth);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error during app preparation:', e);
        setIsAuthenticated(false);
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
        // Mostrar splash screen inicial, no redirigir automáticamente
        // El usuario decidirá si registrarse o hacer login
      }
    }
  }, [appIsReady, isAuthenticated, router]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaProvider>
        <Stack initialRouteName='index' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="registerScreen" options={{ headerShown: false }} />
          <Stack.Screen name="forgotPasswordScreen" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}