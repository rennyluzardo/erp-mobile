import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  geckoGreen,
  primaryBackground,
  primaryTextColor,
  secondaryTextColor,
} from '../../../constants/Colors';
import { responsiveNormalTextFontSize } from '../../../constants/Fonts';
import { useAddProduct } from '../../../contexts/AddProductContext';
import Header from '../../../components/Header';

const { width, height } = Dimensions.get('window');
const borderRadiusStandard = width * 0.01;
const buttonPaddingVertical = height * 0.012;

export default function AddProductStep1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { formData, updateField, validateStep } = useAddProduct();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImagePick = () => {
    // TODO: Implement image picker when expo-image-picker is installed
    Alert.alert('Función no disponible', 'La selección de imagen estará disponible en una futura versión');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.price_bs.trim()) {
      newErrors.price_bs = 'El precio en Bs es requerido';
    } else if (isNaN(Number(formData.price_bs)) || Number(formData.price_bs) <= 0) {
      newErrors.price_bs = 'El precio en Bs debe ser un número válido mayor a 0';
    }

    if (!formData.price_usd.trim()) {
      newErrors.price_usd = 'El precio en USD es requerido';
    } else if (isNaN(Number(formData.price_usd)) || Number(formData.price_usd) <= 0) {
      newErrors.price_usd = 'El precio en USD debe ser un número válido mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      router.push('/(modal)/add-product/step2');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Está seguro de que desea cancelar la creación del producto? Se perderán los datos ingresados.',
      [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Cancelar', onPress: () => router.back(), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Header
        variant="simple"
        title="Inventario"
        leftButtonText="Salir"
        onBackPress={handleCancel}
        showMenu={true}
        onMenuPress={() => {}}
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <Text style={[styles.progressText, styles.activeText]}>Información básica</Text>
        </View>
        <View style={styles.progressConnector} />
        <View style={styles.progressStep}>
          <View style={styles.progressDot} />
          <Text style={styles.progressText}>Detalles del Producto</Text>
        </View>
        <View style={styles.progressConnector} />
        <View style={styles.progressStep}>
          <View style={styles.progressDot} />
          <Text style={styles.progressText}>Inventario y Gestión</Text>
        </View>
      </View>

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>
          Nuevo producto - Formulario para agregar un nuevo producto al inventario (step 1)
        </Text>

        {/* Image Upload */}
        <TouchableOpacity style={styles.imageUpload} onPress={handleImagePick}>
          {formData.image_uri ? (
            <Image source={{ uri: formData.image_uri }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Agregar imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => {
              updateField('name', value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Ingrese el nombre del producto"
            placeholderTextColor={secondaryTextColor}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Price Bs Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Precio (Bs) *</Text>
          <TextInput
            style={[styles.input, errors.price_bs && styles.inputError]}
            value={formData.price_bs}
            onChangeText={(value) => {
              updateField('price_bs', value);
              if (errors.price_bs) setErrors({ ...errors, price_bs: '' });
            }}
            placeholder="0.00"
            placeholderTextColor={secondaryTextColor}
            keyboardType="numeric"
          />
          {errors.price_bs && <Text style={styles.errorText}>{errors.price_bs}</Text>}
        </View>

        {/* Price USD Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Precio ($) *</Text>
          <TextInput
            style={[styles.input, errors.price_usd && styles.inputError]}
            value={formData.price_usd}
            onChangeText={(value) => {
              updateField('price_usd', value);
              if (errors.price_usd) setErrors({ ...errors, price_usd: '' });
            }}
            placeholder="0.00"
            placeholderTextColor={secondaryTextColor}
            keyboardType="numeric"
          />
          {errors.price_usd && <Text style={styles.errorText}>{errors.price_usd}</Text>}
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Paso siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: responsiveNormalTextFontSize + 2,
    fontWeight: 'bold',
    color: primaryTextColor,
  },
  menuButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuButtonText: {
    fontSize: responsiveNormalTextFontSize + 8,
    color: primaryTextColor,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressConnector: {
    width: 30,
    height: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginHorizontal: 4,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  activeDot: {
    backgroundColor: geckoGreen,
  },
  progressText: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
    textAlign: 'center',
    marginTop: 4,
  },
  activeText: {
    color: geckoGreen,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: responsiveNormalTextFontSize + 1,
    color: secondaryTextColor,
    marginBottom: 24,
    textAlign: 'center',
  },
  imageUpload: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    padding: 12,
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: responsiveNormalTextFontSize - 2,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: primaryBackground,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    paddingVertical: buttonPaddingVertical,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    backgroundColor: geckoGreen,
    borderRadius: borderRadiusStandard,
    paddingVertical: buttonPaddingVertical,
    marginLeft: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: '#fff',
    fontWeight: 'bold',
  },
});
