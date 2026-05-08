import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AuthForm from '../../components/AuthForm';
import { useDatabase } from '../_layout';
import { createUser } from '../../database/queries';
import { primaryTextColor, geckoGreen } from '../../constants/Colors';

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

export default function RegisterScreen() {
  const router = useRouter();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const database = useDatabase();

  const handleRegister = async (
    username: string,
    password?: string,
    email?: string,
    confirmPassword?: string,
  ) => {
    if (!username || !password || password !== confirmPassword) {
      setRegistrationError('Por favor, verifica tus datos.');
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      if (database) {
        const newUser = await createUser(database, username, password);
        if (newUser) {
          console.log('Usuario registrado exitosamente:', newUser.username);
          router.replace('/(auth)/loginScreen');
        } else {
          setRegistrationError('Error al crear la cuenta. Por favor, intenta de nuevo.');
        }
      } else {
        setRegistrationError('La base de datos no se ha inicializado correctamente.');
      }
    } catch (error: any) {
      console.error('Error durante el registro:', error.message);
      if (error.message?.includes('UNIQUE constraint failed')) {
        setRegistrationError('Ese nombre de usuario ya está en uso. Por favor, elige otro.');
      } else {
        setRegistrationError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace('/(auth)/loginScreen');
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
              <Text style={styles.logoText}>Gecko</Text>
              <Text style={styles.subtitle}>
                Tu negocio a la mano
              </Text>
            </>
          </View>
          <AuthForm onSubmit={handleRegister} isSignIn={true} isLoading={isRegistering} />
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
    color: geckoGreen,
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
    color: geckoGreen,
    fontWeight: 'bold',
  },
});