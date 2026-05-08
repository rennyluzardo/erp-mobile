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
import { fetchMeasurementUnits, createInventoryItem } from '../../../database/queries';
import Header from '../../../components/Header';

const { width, height } = Dimensions.get('window');
const borderRadiusStandard = width * 0.01;
const buttonPaddingVertical = height * 0.012;

export default function AddProductStep3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const { formData, updateField, validateStep, resetForm } = useAddProduct();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [measurementUnits, setMeasurementUnits] = useState<{ id: number; name: string }[]>([]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadMeasurementUnits = async () => {
      if (!database) return;
      
      try {
        const units = await fetchMeasurementUnits(database);
        setMeasurementUnits(units);
      } catch (error) {
        console.error('Error loading measurement units:', error);
      }
    };

    loadMeasurementUnits();
  }, [database]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.initial_quantity.trim()) {
      newErrors.initial_quantity = 'La cantidad inicial es requerida';
    } else if (isNaN(Number(formData.initial_quantity)) || Number(formData.initial_quantity) < 0) {
      newErrors.initial_quantity = 'La cantidad inicial debe ser un número válido mayor o igual a 0';
    }

    if (!formData.low_stock_threshold.trim()) {
      newErrors.low_stock_threshold = 'La cantidad por agotarse es requerida';
    } else if (isNaN(Number(formData.low_stock_threshold)) || Number(formData.low_stock_threshold) < 0) {
      newErrors.low_stock_threshold = 'La cantidad por agotarse debe ser un número válido mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !database) return;

    setIsSaving(true);
    
    try {
      const productData = {
        barcode: formData.barcode,
        name: formData.name,
        description: undefined,
        quantity: Number(formData.initial_quantity),
        unit: formData.measurement_unit,
        price_usd: Number(formData.price_usd),
        price_bs: Number(formData.price_bs),
        image_uri: formData.image_uri || undefined,
        brand: formData.brand === 'Ninguna' ? undefined : formData.brand,
        category: formData.category === 'Ninguna' ? undefined : formData.category,
        tax_rate: Number(formData.tax_rate),
        low_stock_threshold: Number(formData.low_stock_threshold),
        notify_low_stock: formData.notify_low_stock ? 1 : 0,
        measurement_unit: formData.measurement_unit,
      };

      await createInventoryItem(database, productData);
      
      Alert.alert(
        'Producto Creado',
        'El producto ha sido agregado al inventario exitosamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              router.back();
              router.back();
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'No se pudo crear el producto. Por favor, intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleUnitSelect = (unit: string) => {
    updateField('measurement_unit', unit);
    setShowUnitDropdown(false);
  };

  const handleAddNewUnit = () => {
    if (!newUnitName.trim()) {
      Alert.alert('Error', 'El nombre de la unidad es requerido');
      return;
    }

    // TODO: Add new unit to database
    Alert.alert('Función no disponible', 'La agregación de nuevas unidades estará disponible en una futura versión');
    setShowNewUnitModal(false);
    setNewUnitName('');
  };

  const incrementQuantity = (field: 'initial_quantity' | 'low_stock_threshold') => {
    const currentValue = Number(formData[field]) || 0;
    updateField(field, String(currentValue + 1));
  };

  const decrementQuantity = (field: 'initial_quantity' | 'low_stock_threshold') => {
    const currentValue = Number(formData[field]) || 0;
    if (currentValue > 0) {
      updateField(field, String(currentValue - 1));
    }
  };

  const renderUnitDropdown = () => {
    const selectedUnit = measurementUnits.find(unit => unit.name === formData.measurement_unit);
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.dropdownButton]}
          onPress={() => setShowUnitDropdown(!showUnitDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedUnit?.name || 'Cantidad'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        {showUnitDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
              {measurementUnits.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => handleUnitSelect(item.name)}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.dropdownItem, styles.addNewItem]}
                onPress={() => {
                  setShowUnitDropdown(false);
                  setShowNewUnitModal(true);
                }}
              >
                <Text style={styles.addNewItemText}>+ Agregar nueva unidad de medida</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderQuantityInput = (
    label: string,
    field: 'initial_quantity' | 'low_stock_threshold',
    description: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decrementQuantity(field)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <TextInput
          style={[styles.quantityInput, errors[field] && styles.inputError]}
          value={formData[field]}
          onChangeText={(value) => {
            updateField(field, value);
            if (errors[field]) setErrors({ ...errors, [field]: '' });
          }}
          placeholder="0"
          placeholderTextColor={secondaryTextColor}
          keyboardType="numeric"
          textAlign="center"
        />
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => incrementQuantity(field)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.descriptionText}>{description}</Text>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

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
          <View style={styles.progressDot} />
          <Text style={styles.progressText}>Detalles del Producto</Text>
        </View>
        <View style={styles.progressConnector} />
        <View style={styles.progressStep}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <Text style={[styles.progressText, styles.activeText]}>Inventario y Gestión</Text>
        </View>
      </View>

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>
          Nuevo producto - Formulario para agregar un nuevo producto al inventario (step 3)
        </Text>

        {/* Initial Quantity */}
        {renderQuantityInput(
          'Cantidad inicial',
          'initial_quantity',
          'Coloque la cantidad que posea de este producto en su Inventario, si luego desea agregar más cantidad debe registrar una compra'
        )}

        {/* Measurement Unit */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Unidad de medida</Text>
          {renderUnitDropdown()}
        </View>

        {/* Low Stock Threshold */}
        {renderQuantityInput(
          'Cantidad por agotarse',
          'low_stock_threshold',
          'Coloca el producto en rojo cuando alcance esta cantidad'
        )}

        {/* Low Stock Notification */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => updateField('notify_low_stock', !formData.notify_low_stock)}
          >
            <View style={[styles.checkbox, formData.notify_low_stock && styles.checkboxChecked]}>
              {formData.notify_low_stock && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Enviar notificación al alcanzar la cantidad por agotarse
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.cancelButton, styles.previousButton]} 
          onPress={handleBack}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Paso anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.nextButton, isSaving && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.nextButtonText}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* New Unit Modal */}
      {showNewUnitModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nueva Unidad de Medida</Text>
            <TextInput
              style={styles.modalInput}
              value={newUnitName}
              onChangeText={setNewUnitName}
              placeholder="Nombre de la unidad"
              placeholderTextColor={secondaryTextColor}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setShowNewUnitModal(false);
                  setNewUnitName('');
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleAddNewUnit}
              >
                <Text style={styles.confirmModalButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  quantityButtonText: {
    fontSize: responsiveNormalTextFontSize + 4,
    color: primaryTextColor,
    fontWeight: 'bold',
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    padding: 12,
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
    marginBottom: 4,
    textAlign: 'center',
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
  addNewItem: {
    backgroundColor: '#f0f8ff',
  },
  dropdownItemText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
  },
  addNewItemText: {
    fontSize: responsiveNormalTextFontSize,
    color: erpGreen,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: erpGreen,
    borderColor: erpGreen,
  },
  checkmark: {
    color: '#fff',
    fontSize: responsiveNormalTextFontSize - 2,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: primaryBackground,
  },
  previousButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    paddingVertical: buttonPaddingVertical,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    backgroundColor: erpGreen,
    borderRadius: borderRadiusStandard,
    paddingVertical: buttonPaddingVertical,
    marginLeft: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: borderRadiusStandard * 2,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: responsiveNormalTextFontSize + 2,
    fontWeight: 'bold',
    color: primaryTextColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: borderRadiusStandard,
    padding: 12,
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: buttonPaddingVertical,
    borderRadius: borderRadiusStandard,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  cancelModalButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
  },
  confirmModalButton: {
    backgroundColor: erpGreen,
    marginLeft: 8,
  },
  confirmModalButtonText: {
    fontSize: responsiveNormalTextFontSize,
    color: '#fff',
    fontWeight: 'bold',
  },
});
