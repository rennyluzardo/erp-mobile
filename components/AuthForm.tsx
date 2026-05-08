import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextStyle,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { secondaryColor } from '../constants/Colors'

const geckoGreen = '#25D366';
const geckoBlue = '#007bff';
const textColor = '#333';
const textColorWhite = '#fff';
const placeholderColor = '#999';

const { width, height } = Dimensions.get('window');
const inputFontSize = width * 0.038;
const buttonPaddingVertical = height * 0.012;
const normalTextFontSize = width * 0.035;
const titleFontSize = width * 0.055;
const actionTextFontSize = width * 0.035;
const smallTextFontSize = width * 0.03;
const borderRadiusStandard = width * 0.01;
const borderWidthStandard = width * 0.002;
const inputHeight = height * 0.06;
const marginBottomMedium = height * 0.02;
const marginBottomSmall = height * 0.01;
const marginBottomLarge = height * 0.03;
const isAndroid = Platform.OS === 'android';

interface AuthFormProps {
  onSubmit: (
    username: string,
    password: string,
    email?: string,
    confirmPassword?: string,
    rememberMe?: boolean
  ) => void;
  isLogin?: boolean;
  isForgotPassword?: boolean;
  isSignIn?: boolean;
  isLoading?: boolean;
  errMessage?: string | null;
}

const AuthForm = ({
  onSubmit,
  isLogin = false,
  isSignIn = false,
  isForgotPassword = false,
  errMessage = '',
  isLoading = false,
}: AuthFormProps) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const usernameAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

  const animatePlaceholder = (animValue: Animated.Value, isFocused: boolean, textValue: string) => {
    Animated.timing(animValue, {
      toValue: isFocused || textValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = (field: string) => {
    switch (field) {
      case 'username':
        setIsUsernameFocused(true);
        break;
      case 'password':
        setIsPasswordFocused(true);
        break;
      case 'email':
        setIsEmailFocused(true);
        break;
      case 'confirmPassword':
        setIsConfirmPasswordFocused(true);
        break;
    }
  };

  const handleBlur = (field: string) => {
    switch (field) {
      case 'username':
        setIsUsernameFocused(false);
        break;
      case 'password':
        setIsPasswordFocused(false);
        break;
      case 'email':
        setIsEmailFocused(false);
        break;
      case 'confirmPassword':
        setIsConfirmPasswordFocused(false);
        break;
    }
  };

  useEffect(() => {
    animatePlaceholder(usernameAnim, isUsernameFocused, username);
  }, [isUsernameFocused, username]);

  useEffect(() => {
    animatePlaceholder(passwordAnim, isPasswordFocused, password);
  }, [isPasswordFocused, password]);

  useEffect(() => {
    animatePlaceholder(emailAnim, isEmailFocused, email);
  }, [isEmailFocused, email]);

  useEffect(() => {
    animatePlaceholder(confirmPasswordAnim, isConfirmPasswordFocused, confirmPassword);
  }, [isConfirmPasswordFocused, confirmPassword]);

  useEffect(() => {
    setErrorMessage(errMessage)
  },[errMessage])

  const getPlaceholderAnimationStyle = (animValue: Animated.Value) => ({
    ...({ position: 'absolute', left: 0, color: placeholderColor } as import('react-native').TextStyle),
    bottom: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [borderWidthStandard + 5, -inputFontSize - 5],
    }),
    fontSize: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [inputFontSize, normalTextFontSize - 2],
    }),
  });

  const handleSubmit = () => {
    setErrorMessage(null);
    if (!username) {
      setErrorMessage('Por favor, ingresa tu nombre de usuario.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor, ingresa tu contraseña.');
      return;
    }
    if (isSignIn && !email) {
      setErrorMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }
    if (isSignIn && !confirmPassword) {
      setErrorMessage('Por favor, confirma tu contraseña.');
      return;
    }
    if (isSignIn && password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    onSubmit(username, password, email, confirmPassword, rememberMe);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={[styles.title, { fontSize: titleFontSize }]}>
        {isForgotPassword && 'Recuperar contraseña'}
        {isLogin && 'Iniciar sesión'}
        {isSignIn && 'Crear cuenta'}
      </Text>
      
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputContainer}>
        <Animated.Text style={getPlaceholderAnimationStyle(usernameAnim)}>
          Nombre de usuario
        </Animated.Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="default"
          onFocus={() => handleFocus('username')}
          onBlur={() => handleBlur('username')}
          blurOnSubmit
        />
      </View>

      {isSignIn && (
        <View style={styles.inputContainer}>
          <Animated.Text style={getPlaceholderAnimationStyle(emailAnim)}>Correo electrónico</Animated.Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            blurOnSubmit
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Animated.Text style={getPlaceholderAnimationStyle(passwordAnim)}>Contraseña</Animated.Text>
        <TextInput
          style={[styles.input, { paddingRight: width * 0.28 }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          blurOnSubmit
        />
        {
          isLogin && (
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push('/(auth)/forgotPasswordScreen')}>
              <Text
                style={[styles.forgotPasswordText, { fontSize: smallTextFontSize }]}
              >¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )
        }
      </View>

      {isSignIn && (
        <View style={styles.inputContainer}>
          <Animated.Text style={getPlaceholderAnimationStyle(confirmPasswordAnim)}>Confirmar contraseña</Animated.Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={() => handleBlur('confirmPassword')}
            blurOnSubmit
          />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          {
            paddingVertical: buttonPaddingVertical,
            borderRadius: borderRadiusStandard,
            marginTop: marginBottomLarge
          }
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={textColorWhite} />
        ) : (
          <Text style={[styles.buttonText, { fontSize: normalTextFontSize + 2, fontWeight: 'bold' }]}>
            {isLogin && 'Iniciar sesión'}
            {isSignIn && 'Crear cuenta'}
            {isForgotPassword && 'Confirmar'}
          </Text>
        )}
      </TouchableOpacity>

      {
        !isForgotPassword && (
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={[styles.dividerText, { fontSize: normalTextFontSize }]}>o continúa con</Text>
            <View style={styles.divider} />
          </View>
        )
      }

      {
        !isForgotPassword && (
          <TouchableOpacity style={[styles.googleButton, { borderRadius: borderRadiusStandard, borderWidth: borderWidthStandard, paddingVertical: buttonPaddingVertical }]} onPress={() => console.log('Continuar con Google')}>
            <Text style={{ fontSize: normalTextFontSize }}>Google</Text>
          </TouchableOpacity>
        )
      }

      {
        isLogin && (
          <View style={styles.signupContainer}>
            <Text style={[styles.normalText, { fontSize: normalTextFontSize }]}>¿Aún no tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/registerScreen')}>
              <Text style={[styles.actionText, { fontSize: actionTextFontSize, fontWeight: 'bold' }]}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        )
      }

      {
        isSignIn && (
          <View style={styles.bottomTextContainer}>
            <Text style={[styles.normalText, { fontSize: normalTextFontSize }]}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/loginScreen')}>
              <Text style={[styles.actionText, { fontSize: actionTextFontSize, fontWeight: 'bold' }]}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>

          // <View style={styles.loginContainer}>
          //   <Text style={styles.normalText}>¿Ya tienes una cuenta? </Text>
          //   <TouchableOpacity onPress={handleGoToLogin}>
          //     <Text style={styles.actionText}>Inicia sesión</Text>
          //   </TouchableOpacity>
          // </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: marginBottomMedium,
    textAlign: 'center',
    color: textColor,
    alignSelf: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: marginBottomMedium,
  },
  input: {
    width: '100%',
    height: inputHeight,
    fontSize: inputFontSize,
    color: textColor,
    borderBottomWidth: borderWidthStandard,
    borderBottomColor: '#ccc',
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: geckoGreen,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: textColorWhite,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: marginBottomSmall,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: isAndroid ? 5 : 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    marginTop: marginBottomSmall / 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    width: 100,
    textAlign: 'right',
  },
  forgotPasswordText: {
    color: secondaryColor,
    textAlign: 'right',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: marginBottomSmall,
  },
  checkbox: {
    width: width * 0.045,
    height: width * 0.045,
    borderWidth: borderWidthStandard,
    borderColor: '#ccc',
    borderRadius: borderRadiusStandard / 2,
    marginLeft: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: borderRadiusStandard / 4,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: geckoGreen,
  },
  rememberMeText: {
    color: textColor,
    marginRight: width * 0.02,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    flex: 1,
    height: borderWidthStandard,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  dividerText: {
    marginHorizontal: width * 0.025,
    color: '#666',
  },
  googleButton: {
    width: '100%',
    borderColor: '#ccc',
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: marginBottomLarge,
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: marginBottomLarge
  },
  normalText: {
    color: textColor,
  },
  actionText: {
    color: secondaryColor,
    fontWeight: 'bold',
  },
});

export default AuthForm;