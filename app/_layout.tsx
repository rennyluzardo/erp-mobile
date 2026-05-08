import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { getDatabase } from '../database';
import { useColorScheme } from '@/components/useColorScheme';
import { seedAdminUser } from '../database/seeders';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Database Context
const DatabaseContext = createContext<SQLite.SQLiteDatabase | null>(null);
export const useDatabase = () => useContext(DatabaseContext);

// Database Provider
const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [database, setDatabase] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    getDatabase().then((db) => {
      setDatabase(db);
    }).catch((err) => {
      console.error('Error initializing database:', err);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <DatabaseProvider>
      <RootLayoutNav />
    </DatabaseProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const database = useDatabase();

  useEffect(() => {
    if (database) {
      console.log('SQLite Database ready.');
      seedAdminUser(database);
    }
  }, [database]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)" options={{ headerShown: false, presentation: 'modal', title: '' }} />
        <Stack.Screen name="modal" options={{ headerShown: false, presentation: 'modal', title: '' }} />
      </Stack>
    </ThemeProvider>
  );
}