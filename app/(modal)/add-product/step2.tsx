import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  erpGreen,
  primaryBackground,
  primaryTextColor,
  secondaryTextColor,
} from '../../../constants/Colors';
import { responsiveNormalTextFontSize } from '../../../constants/Fonts';
import { useAddProduct } from '../../../contexts/AddProductContext';
import { useDatabase } from '../../_layout';
import { fetchBrands, fetchCategories } from '../../../database/queries';
import Header from '../../../components/Header';

const { width, height } = Dimensions.get('window');
const borderRadiusStandard = width * 0.01;
const buttonPaddingVertical = height * 0.012;

const TAX_RATES = [
  { label: 'Ninguna', value: 'none' },
  { label: '0%', value: '0' },
  { label: '8%', value: '0.08' },
  { label: '12%', value: '0.12' },
  { label: '16%', value: '0.16' },
  { label: '21%', value: '0.21' },
];

export default function AddProductStep2() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const { formData, updateField, validateStep } = useAddProduct();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTaxDropdown, setShowTaxDropdown] = useState(false);

  useEffect(() => {
    const loadDropdownData = async () => {
      if (!database) return;
      
      try {
        const [brandsData, categoriesData] = await Promise.all([
          fetchBrands(database),
          fetchCategories(database),
        ]);
        
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    };

    loadDropdownData();
  }, [database]);

  const handleBarcodeScan = () => {
    // TODO: Implement barcode scanner integration
    Alert.alert('Función no disponible', 'El escáner de códigos de barras estará disponible en una futura versión');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.barcode.trim()) {
      newErrors.barcode = 'El código de barras es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      router.push('/(modal)/add-product/step3');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleBrandSelect = (brand: string) => {
    updateField('brand', brand);
    setShowBrandDropdown(false);
  };

  const handleCategorySelect = (category: string) => {
    updateField('category', category);
    setShowCategoryDropdown(false);
  };

  const handleTaxSelect = (tax: string) => {
    updateField('tax_rate', tax);
    setShowTaxDropdown(false);
  };

  const renderBrandDropdown = () => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, errors.brand && styles.inputError]}
        onPress={() => setShowBrandDropdown(!showBrandDropdown)}
      >
        <Text style={styles.dropdownText}>
          {formData.brand || 'Ninguna'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      
      {showBrandDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
            {brands.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => handleBrandSelect(item.name)}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderCategoryDropdown = () => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, errors.brand && styles.inputError]}
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        <Text style={styles.dropdownText}>
          {formData.category || 'Ninguna'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      
      {showCategoryDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => handleCategorySelect(item.name)}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderTaxDropdown = () => {
    const selectedTax = TAX_RATES.find(rate => rate.value === formData.tax_rate);
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.dropdownButton, errors.brand && styles.inputError]}
          onPress={() => setShowTaxDropdown(!showTaxDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedTax?.label || 'Ninguna'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        {showTaxDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
              {TAX_RATES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownItem}
                  onPress={() => handleTaxSelect(item.value)}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Header
        variant="simple"
        title="Inventario"
        leftButtonText="Atrás"
        onBackPress={handleBack}
        showMenu={true}
        onMenuPress={() => {}}
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={styles.progressDot} />
          <Text style={styles.progressText}>Información básica</Text>
        </View>
        <View style={styles.progressConnector} />
        <View style={styles.progressStep}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <Text style={[styles.progressText, styles.activeText]}>Detalles del Producto</Text>
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
          Nuevo producto - Formulario para agregar un nuevo producto al inventario (step 2)
        </Text>

        {/* Barcode Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Código de barras</Text>
          <View style={styles.barcodeContainer}>
            <TextInput
              style={[styles.barcodeInput, errors.barcode && styles.inputError]}
              value={formData.barcode}
              onChangeText={(value) => {
                updateField('barcode', value);
                if (errors.barcode) setErrors({ ...errors, barcode: '' });
              }}
              placeholder="Ingrese el código de barras"
              placeholderTextColor={secondaryTextColor}
            />
            <TouchableOpacity style={styles.scanButton} onPress={handleBarcodeScan}>
              <Text style={styles.scanButtonText}>📷</Text>
            </TouchableOpacity>
          </View>
          {errors.barcode && <Text style={styles.errorText}>{errors.barcode}</Text>}
        </View>

        {/* Brand Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Marca</Text>
          {renderBrandDropdown()}
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Categoría</Text>
          {renderCategoryDropdown()}
        </View>

        {/* Tax Rate Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>I.V.A.</Text>
          {renderTaxDropdown()}
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
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
    marginBottom: 8,
  },
  activeDot: {
    backgroundColor: erpGreen,
  },
  progressText: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
    textAlign: 'center',
  },
  activeText: {
    color: erpGreen,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    marginBottom: 8,
    fontWeight: '500',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    padding: 12,
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  scanButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  scanButtonText: {
    fontSize: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: responsiveNormalTextFontSize - 2,
    marginTop: 4,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
  },
  dropdownArrow: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: primaryBackground,
  },
  nextButton: {
    backgroundColor: erpGreen,
    borderRadius: borderRadiusStandard,
    paddingVertical: buttonPaddingVertical,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: '#fff',
    fontWeight: 'bold',
  },
});
