import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform, 
  TextInput, 
  TouchableOpacity,
  Animated, 
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { geckoGreen, primaryTextColor, secondaryColor } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Appbar, Searchbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Corrección aquí

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
}: HeaderProps) => {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const { width, height } = Dimensions.get('window');
  const appbarWidth = useRef(new Animated.Value(1)).current; // Starts at full width (for iOS animation)

  const handleInternalBackPress = () => {
    setIsFocused(false);
    if (onBlurSearch) {
      onBlurSearch();
    }
    if (onInternalBackPress) {
      onInternalBackPress(); // Notifica al componente padre
    }
    Keyboard.dismiss(); // Asegurarse de que el teclado se cierre al presionar atrás
  };

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
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    console.log("handleFocus")
    setIsFocused(true);
    if (onFocusSearch) {
      onFocusSearch();
    }
    if (Platform.OS === 'ios') {
      setShowCancelButton(true);
      Animated.timing(appbarWidth, {
        toValue: 0.99,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    console.log("handleblur")
    setIsFocused(false);
    // showBackButton
    if (onBlurSearch) {
      onBlurSearch();
    }
    if (Platform.OS === 'ios') {
      setShowCancelButton(false);
      Animated.timing(appbarWidth, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCancel = () => {
    setSearchText('');
    setShowCancelButton(false);
    Keyboard.dismiss();
    Animated.timing(appbarWidth, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsFocused(false);
      if (onBlurSearch) {
        onBlurSearch();
      }
    });
  };

  const androidContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <TouchableOpacity
        onPress={handleInternalBackPress}
        style={[
          styles.internalBackButton,
          !isFocused && Platform.OS === 'android' && { width: 0, opacity: 0 }
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={primaryTextColor} />
      </TouchableOpacity>
      <Searchbar
        placeholder="¿Qué necesitas hoy?"
        onChangeText={handleSearchChange}
        onIconPress={handleSearchSubmit}
        style={{ flex: 1, height: 50, }}
        icon={() => <Ionicons name="search" size={24} color={primaryTextColor} />}
        value={searchText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        focusable={true}
        onPress={handleFocus} // Mostrar el botón de atrás al tocar
      />
    </View>
  );

  const iosContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <Ionicons name="search" size={24} color={primaryTextColor} style={{ marginHorizontal: 8 }} />
      <TextInput
        ref={searchInputRef}
        placeholder="¿Qué necesitas hoy?"
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSearchSubmit}
        style={[styles.iosSearchBarStyle, styles.iosSearchInputStyle, { flex: 1 }]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={searchText}
      />
      {showCancelButton && (
        <TouchableOpacity onPress={handleCancel}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View>
      <Appbar.Header statusBarHeight={Platform.OS === 'ios' ? insets.top : 0} style={styles.appbar}>
        {showBackButton && Platform.OS === 'android' && !isFocused && (
          <Appbar.BackAction onPress={onBackPress} color={primaryTextColor} />
        )}
        <Animated.View style={{ flex: Platform.OS === 'ios' ? appbarWidth : 1 }}>
          {Platform.OS === 'android' ? androidContent : iosContent}
        </Animated.View>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {rightComponent}
        </View> */}
      </Appbar.Header>

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
  appbar: {
    // backgroundColor: geckoGreen,
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
});

export default Header;