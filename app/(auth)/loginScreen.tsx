import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AuthForm from '../../components/AuthForm';
import { useDatabase } from '../_layout';
import { fetchUserByUsername } from '../../database/queries';
import { primaryTextColor, erpGreen } from '../../constants/Colors';
import { saveAuthToken, saveUserId } from '../../utils/auth';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const logoSize = isSmallScreen ? width * 0.2 : width * 0.25;
const logoTextSize = isSmallScreen ? width * 0.08 : width * 0.12;
const subtitleWidthPercentage = isSmallScreen ? 0.8 : 0.7;
const normalTextFontSize = width * 0.035;
const marginBottomSmall = height * 0.01;
const marginBottomMedium = height * 0.02;
const marginBottomLarge = height * 0.03;
const isAndroid = Platform.OS === 'android';

export default function LoginScreen() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const database = useDatabase();

  const handleLogin = async (
    username: string,
    password?: string,
  ) => {
    if (!username || !password) {
      setLoginError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      if (database) {
        const user = await fetchUserByUsername(database, username);

        if (user && user.password === password) {
          console.log('Inicio de sesión exitoso para:', user.username);
          
          // Save session data to secure storage
          try {
            await saveAuthToken(user.id.toString()); // Using user ID as a simple token for now
            await saveUserId(user.id.toString());
            console.log('Session data saved successfully');
            
            router.replace('/(tabs)');
          } catch (saveError) {
            console.error('Error saving session data:', saveError);
            setLoginError('Error al guardar la sesión. Por favor, intenta de nuevo.');
          }
        } else {
          setLoginError('Usuario o contraseña incorrectos.');
        }
      } else {
        setLoginError('La base de datos no se ha inicializado correctamente.');
      }
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error.message);
      setLoginError('Ocurrió un error inesperado durante el inicio de sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoToRegister = () => {
    router.replace('/(auth)/registerScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -height * 0.05}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoPlaceholder, { width: logoSize, height: logoSize, borderRadius: logoSize / 3.5 }]} />
            <>
              <Text style={styles.logoText}>ERP-System</Text>
              <Text style={styles.subtitle}>
                Tu negocio a la mano
              </Text>
            </>
          </View>

          <AuthForm
            onSubmit={handleLogin}
            isLogin={true}
            isLoading={isLoggingIn}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.normalText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={handleGoToRegister}>
              <Text style={styles.actionText}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: !isAndroid ? marginBottomMedium : undefined,
    width: '90%',
    maxWidth: 400,
    paddingHorizontal: width * 0.025,
    backgroundColor: '#fff',
    minHeight: height * 0.8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: marginBottomLarge,
  },
  logoPlaceholder: {
    width: logoSize,
    height: logoSize,
    borderRadius: logoSize / 3.5,
    backgroundColor: '#f0f0f0',
    marginBottom: marginBottomSmall / 2,
  },
  logoText: {
    fontSize: logoTextSize,
    fontWeight: 'bold',
    color: erpGreen,
    textAlign: 'center',
    marginBottom: marginBottomSmall / 4,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    width: width * subtitleWidthPercentage,
    fontSize: normalTextFontSize,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: isAndroid ? marginBottomLarge : marginBottomSmall,
  },
  normalText: {
    color: primaryTextColor,
  },
  actionText: {
    color: erpGreen,
    fontWeight: 'bold',
  },
});