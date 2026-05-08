import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Form data interface matching the prototype fields
export interface AddProductFormData {
  // Step 1: Basic Information
  name: string;
  price_bs: string;
  price_usd: string;
  image_uri: string | null;
  
  // Step 2: Product Details
  barcode: string;
  brand: string;
  category: string;
  tax_rate: string;
  
  // Step 3: Inventory and Management
  initial_quantity: string;
  measurement_unit: string;
  low_stock_threshold: string;
  notify_low_stock: boolean;
}

// Initial form state
const initialFormData: AddProductFormData = {
  name: '',
  price_bs: '',
  price_usd: '',
  image_uri: null,
  barcode: '',
  brand: 'Ninguna',
  category: 'Ninguna',
  tax_rate: '0',
  initial_quantity: '1',
  measurement_unit: 'Cantidad',
  low_stock_threshold: '1',
  notify_low_stock: true,
};

// Action types
type AddProductAction =
  | { type: 'UPDATE_FIELD'; field: keyof AddProductFormData; value: any }
  | { type: 'RESET_FORM' }
  | { type: 'SET_STEP_DATA'; step: 1 | 2 | 3; data: Partial<AddProductFormData> };

// Reducer function
function addProductReducer(state: AddProductFormData, action: AddProductAction): AddProductFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'RESET_FORM':
      return initialFormData;
    case 'SET_STEP_DATA':
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}

// Context interface
interface AddProductContextType {
  formData: AddProductFormData;
  updateField: (field: keyof AddProductFormData, value: any) => void;
  resetForm: () => void;
  setStepData: (step: 1 | 2 | 3, data: Partial<AddProductFormData>) => void;
  validateStep: (step: 1 | 2 | 3) => boolean;
}

// Create context
const AddProductContext = createContext<AddProductContextType | undefined>(undefined);

// Provider component
export function AddProductProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = useReducer(addProductReducer, initialFormData);

  const updateField = (field: keyof AddProductFormData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const setStepData = (step: 1 | 2 | 3, data: Partial<AddProductFormData>) => {
    dispatch({ type: 'SET_STEP_DATA', step, data });
  };

  const validateStep = (step: 1 | 2 | 3): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name.trim() && formData.price_bs.trim() && formData.price_usd.trim());
      case 2:
        return !!(formData.barcode.trim());
      case 3:
        return !!(formData.initial_quantity.trim() && formData.low_stock_threshold.trim());
      default:
        return false;
    }
  };

  const value: AddProductContextType = {
    formData,
    updateField,
    resetForm,
    setStepData,
    validateStep,
  };

  return <AddProductContext.Provider value={value}>{children}</AddProductContext.Provider>;
}

// Hook to use the context
export function useAddProduct() {
  const context = useContext(AddProductContext);
  if (context === undefined) {
    throw new Error('useAddProduct must be used within an AddProductProvider');
  }
  return context;
}
