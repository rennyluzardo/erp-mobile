import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AuthForm from '../../components/AuthForm';
import { primaryTextColor, geckoGreen } from '../../constants/Colors';
import { responsiveNormalTextFontSize } from '../../constants/Fonts';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const logoSize = isSmallScreen ? width * 0.2 : width * 0.25;
const logoTextSize = isSmallScreen ? width * 0.08 : width * 0.12;
const subtitleWidthPercentage = isSmallScreen ? 0.8 : 0.7;
const titleFontSize = width * 0.055;
const marginBottomSmall = height * 0.01;
const marginBottomMedium = height * 0.02;
const marginBottomLarge = height * 0.03;
const isAndroid = Platform.OS === 'android';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async (username: string) => {
    setIsResetting(true);
    setResetPasswordError(null);
    // Aquí implementarías la lógica para enviar un correo de restablecimiento de contraseña
    console.log('Solicitud de restablecimiento para:', username);
    setTimeout(() => {
      setIsResetting(false);
      alert(`Se ha enviado un correo electrónico a ${username} para restablecer tu contraseña.`);
      router.replace('/(auth)/loginScreen');
    }, 2000); // Simulación de envío de correo
  };

  const handleGoBack = () => {
    router.replace('/(auth)/loginScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -height * 0.05}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder} />
            <Text style={[styles.logoText, { fontSize: logoTextSize }]}>Gecko</Text>
            <Text
              style={[styles.subtitle, { width: width * subtitleWidthPercentage, textAlign: 'center', fontSize: responsiveNormalTextFontSize }]}
            >
              Tu negocio a la mano
            </Text>
          </View>
          {resetPasswordError && <Text style={styles.errorText}>{resetPasswordError}</Text>}
          <AuthForm
            onSubmit={handleResetPassword}
            isForgotPassword
            isLoading={isResetting}
          />
          <TouchableOpacity onPress={handleGoBack} style={styles.backToLoginButton}>
            <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: !isAndroid ? marginBottomMedium : 'unset',
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
    backgroundColor: '#f0f0f0',
    marginBottom: marginBottomSmall / 2,
    width: logoSize,
    height: logoSize,
    borderRadius: logoSize / 3.5,
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
    fontSize: responsiveNormalTextFontSize,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: marginBottomMedium,
    textAlign: 'center',
    color: primaryTextColor,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: marginBottomSmall,
    textAlign: 'center',
  },
  backToLoginButton: {
    marginTop: marginBottomLarge,
  },
  backToLoginText: {
    color: geckoGreen,
    fontWeight: 'bold',
    fontSize: responsiveNormalTextFontSize,
  },
});

export default ForgotPasswordScreen;