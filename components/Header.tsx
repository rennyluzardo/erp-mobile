import React, { useState, useRef, ReactNode } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { erpGreen, primaryTextColor, secondaryColor } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from './SearchBar';

interface HeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: ReactNode;
  onSearchChangeText?: (text: string) => void;
  onSearchSubmit?: (text: string) => void;
  onFocusSearch?: () => void;
  onBlurSearch?: () => void;
  filters?: string[]; // Array de nombres de filtros
  onFilterPress?: (filter: string) => void; // Función para manejar la presión de un filtro
  onFilterButtonPress?: () => void; // Función para manejar la presión del botón "Filtrar"
  onInternalBackPress?: () => void; // Nueva prop para notificar el presionado del botón interno de atrás en Android
  setShowBackButton?: () => void;
  variant?: 'search' | 'simple'; // Nuevo: variant para diferentes modos
  title?: string; // Nuevo: título para el modo simple
  leftButtonText?: string; // Nuevo: texto personalizado para botón izquierdo
  showMenu?: boolean; // Nuevo: mostrar/ocultar menú
  onMenuPress?: () => void; // Nuevo: acción del menú
}

const Header = ({
  showBackButton,
  onBackPress,
  rightComponent,
  onSearchChangeText,
  onSearchSubmit,
  onFocusSearch,
  onBlurSearch,
  filters = ['Filtro 1', 'Filtro 2', 'Filtro 3', 'Filtro 4', 'Filtro 5', 'Filtro 6'], // Ejemplo de filtros
  onFilterPress,
  onFilterButtonPress,
  onInternalBackPress, // Recibe la nueva prop
  variant = 'search', // Nuevo: variant por defecto
  title = '', // Nuevo: título por defecto
  leftButtonText = 'Atrás', // Nuevo: texto por defecto
  showMenu = true, // Nuevo: mostrar menú por defecto
  onMenuPress = () => {}, // Nuevo: acción por defecto
}: HeaderProps) => {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const { width, height } = Dimensions.get('window');

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (onSearchChangeText) {
      onSearchChangeText(text);
    }
  };

  const handleSearchSubmit = () => {
    if (onSearchSubmit) {
      onSearchSubmit(searchText);
    }
  };

  const handleInternalBackPress = () => {
    if (onBlurSearch) {
      onBlurSearch();
    }
    if (onInternalBackPress) {
      onInternalBackPress();
    }
  };

  // Render simple header for product form flow
  if (variant === 'simple') {
    return (
      <View style={styles.simpleHeader}>
        <TouchableOpacity onPress={onBackPress || onInternalBackPress} style={styles.simpleLeftButton}>
          <Text style={styles.simpleLeftButtonText}>{leftButtonText}</Text>
        </TouchableOpacity>
        <Text style={styles.simpleTitle}>{title}</Text>
        {showMenu && (
          <TouchableOpacity onPress={onMenuPress} style={styles.simpleMenuButton}>
            <Text style={styles.simpleMenuButtonText}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Original search header
  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={styles.customHeader}>
        <SearchBar
          value={searchText}
          onChangeText={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onFocus={onFocusSearch}
          onBlur={onBlurSearch}
          showBackButton={showBackButton}
          onBackPress={handleInternalBackPress}
        />
      </View>

      <View style={styles.filterBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollViewContent}>
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() => onFilterPress && onFilterPress(filter)}
            >
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.filterSeparator} />
        <TouchableOpacity style={styles.filterButtonRight} onPress={onFilterButtonPress}>
          <Ionicons name="options-outline" size={20} color={primaryTextColor} />
          <Text style={styles.filterButtonRightText}>Filtrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
  },
  iosSearchBarStyle: Platform.OS === 'ios'
    ? {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
      }
    : {},
  iosSearchInputStyle: Platform.OS === 'ios'
    ? {
        fontSize: 17,
        color: primaryTextColor,
        marginRight: 8,
      }
    : {},
  filterBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: secondaryColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterScrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterText: {
    color: primaryTextColor,
    fontSize: 14,
  },
  filterSeparator: {
    height: 20,
    width: 1,
    backgroundColor: '#ccc',
    marginRight: 16,
  },
  filterButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonRightText: {
    marginLeft: 4,
    color: primaryTextColor,
    fontWeight: 'bold',
  },
  internalBackButton: { // ¡Aquí está la definición del estilo faltante!
    marginRight: 8,
  },
  // Simple header styles for product form flow
  simpleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  simpleLeftButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  simpleLeftButtonText: {
    fontSize: 16,
    color: primaryTextColor,
    fontWeight: '500',
  },
  simpleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryTextColor,
    flex: 1,
    textAlign: 'center',
  },
  simpleMenuButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  simpleMenuButtonText: {
    fontSize: 24,
    color: primaryTextColor,
  },
});

export default Header;