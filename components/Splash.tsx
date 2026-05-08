// components/SplashScreenComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  erpGreen,
  secondaryColor,
  erp1,
  erp2,
  erp3,
  primaryTextColor,
  secondaryTextColor, 
} from '../constants/Colors';
// const erpGreen = '#25D366';
// const secondayColor = '#F08080';
// const erp1 = '#E0FF86';
// const erpBlue = '#E0FF86';
// const primaryTextColor = '#333';
// const secondaryTextColor = '#777';
import { responsiveNormalTextFontSize } from '../constants/Fonts'

const { width, height } = Dimensions.get('window');

// Define responsive font sizes based on screen dimensions
const responsiveTitleFontSize = width * 0.042; // Adjust multiplier as needed
const responsiveSubtitleFontSize = width * 0.04; // Adjust multiplier as needed
const responsiveButtonFontSize = width * 0.045; // Adjust multiplier as needed
const responsiveSecondaryButtonFontSize = width * 0.04; // Adjust multiplier as needed

// Define responsive padding and margins
const horizontalPadding = width * 0.08; // Adjust multiplier as needed
const bottomContainerBottom = height * 0.04; // Adjust multiplier as needed
const textContainerMarginBottom = height * 0.025; // Adjust multiplier as needed
const textContainerMaxWidth = width * 0.9; // Maximum width for text container (adjust as needed)
const buttonVerticalPadding = height * 0.018; // Adjust multiplier as needed
const buttonHorizontalPadding = width * 0.15; // Adjust multiplier as needed
const buttonMarginBottom = height * 0.012; // Adjust multiplier as needed

const Splash = () => {
  const router = useRouter();

  const navigateToRegister = () => {
    router.replace('/(auth)/registerScreen');
  };

  const navigateToLogin = () => {
    router.replace('/(auth)/loginScreen');
  };

  return (
    <View style={styles.container}>
      {/* Slider de imágenes en posición absoluta */}
      <View style={styles.carouselContainer}>
        {/* <Image
          source={require('../assets/images/splash.jpeg')}
          style={styles.carouselImage}
          resizeMode="cover"
        /> */}
        {/* Mock Image */}
        <View style={styles.carouselImage}>
          <Text>.png 1</Text>
        </View>
        {/* Arrows para el slider */}
        <TouchableOpacity style={styles.arrowLeft}>
          {/* <MaterialCommunityIcons name='chevron-left' size={40} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowRight}>
          {/* <MaterialCommunityIcons name='chevron-right' size={40}/> */}
        </TouchableOpacity>
      </View>

      {/* Contenido inferior */}
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Administra tu negocio con <Text style={styles.erpText}>ERP-System</Text>
          </Text>
          <Text style={styles.subtitle}>
            Lleva el control de tu negocio desde tu celular y administra tus ventas de manera simple.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { paddingVertical: buttonVerticalPadding, paddingHorizontal: buttonHorizontalPadding, marginBottom: buttonMarginBottom, width: '100%' }]}
          onPress={navigateToRegister}
        >
          <Text style={[styles.primaryButtonText, { fontSize: responsiveButtonFontSize }]}>Comenzar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ paddingVertical: 10 }} onPress={navigateToLogin}>
          <Text style={[styles.secondaryButtonText, { fontSize: responsiveNormalTextFontSize, textAlign: 'center' }]}>
            ¿Ya tienes una cuenta? <Text style={styles.loginText}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
  },
  carouselContainer: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    flex: 2,
    width: '100%',
    // maxHeight: '50%',
    justifyContent: 'center',
    alignItems: 'center',

    // backgroundColor: 'firebrick'
  },
  carouselImage: {
    width: 200,
    height: 200,
    backgroundColor: erp1,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 10,
    color: erp1,
  },
  arrowRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: primaryTextColor,
  },
  bottomContainer: {
    // position: 'absolute',
    // flex: 1,
    // left: 0,
    width: '100%',
    // maxHeight: '50%',
    flex: 1,
    alignItems: 'center',
    // bottom: bottomContainerBottom,
    paddingHorizontal: horizontalPadding,
    // backgroundColor: '#000000',

    display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: textContainerMarginBottom,
    maxWidth: textContainerMaxWidth,
  },
  title: {
    fontWeight: 'bold',
    color: primaryTextColor,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: responsiveTitleFontSize,
  },
  erpText: {
    color: erpGreen,
    fontSize: 18,
  },
  subtitle: {
    color: secondaryTextColor,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: responsiveSubtitleFontSize,
  },
  primaryButton: {
    backgroundColor: erpGreen,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: primaryTextColor,
    textAlign: 'center',
  },
  loginText: {
    color: secondaryColor,
    fontWeight: 'bold',
  },
});

export default Splash;