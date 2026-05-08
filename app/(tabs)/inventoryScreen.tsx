// inventoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native'; // Importa Platform desde 'react-native'
import { useRouter } from 'expo-router';
import {
  erpGreen,
  primaryBackground,
  primaryTextColor,
  secondaryTextColor
} from '../../constants/Colors';
import { responsiveNormalTextFontSize } from '../../constants/Fonts';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchAllInventoryItems, InventoryRow } from '../../database/queries';
import { useFocusEffect } from '@react-navigation/native';
import { useDatabase } from '../_layout';

const { width, height } = Dimensions.get('window');
const marginBottomSmall = height * 0.01;
const borderRadiusStandard = width * 0.01;
const buttonPaddingVertical = height * 0.012;

const InventoryScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const database = useDatabase();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showBackButton, setShowBackButton] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = useCallback(async () => {
    if (!database) return;
    setLoading(true);
    try {
      const items = await fetchAllInventoryItems(database);
      setInventoryItems(items);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el inventario');
      setLoading(false);
    }
  }, [database]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [loadInventory])
  );

  const handleSearchChangeText = (text: string) => {
    setSearchText(text);
    console.log('Texto de búsqueda cambiado:', text);
    // Aquí puedes implementar la lógica para filtrar los resultados en tiempo real
  };

  const handleSearchSubmit = (text: string) => {
    console.log('Búsqueda enviada:', text);
    // Aquí puedes implementar la lógica para realizar la búsqueda
  };

  const handleFocusSearch = () => {
    setIsSearchFocused(true);
  };

  const handleBlurSearch = () => {
    setIsSearchFocused(false);
  };

  const handleFilterPress = (filter: string) => {
    console.log('Filtro presionado:', filter);
    // Aquí puedes implementar la lógica para aplicar el filtro seleccionado
  };

  const handleFilterButtonPress = () => {
    console.log('Botón Filtrar presionado');
    // Aquí puedes implementar la lógica para mostrar las opciones de filtrado avanzadas
  };

  const filtrosDisponibles = ['Precio Bajo', 'Precio Alto', 'Más Vendidos', 'Nuevos', 'Ofertas'];


  const renderItem = ({ item }: { item: InventoryRow }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => router.push(`/inventory/${item.id}`)}>
      <View style={styles.listItemContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemDetails}>
            <View style={styles.quantityContainer}>
              <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
              <Text style={styles.itemUnit}> {item.unit}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.itemPriceUSD}>Precio USD: ${item.price_usd?.toFixed(2) ?? '0.00'}</Text>
              <Text style={styles.itemPriceBS}>Precio BsS: {item.price_bs?.toFixed(2) ?? '0.00'}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const navigateToAddProduct = () => {
    router.push('/(modal)/add-product/step1');
  };

  const handleGoBack = () => {
    setIsSearchFocused(false);
    router.back();
  };

  // Calcula la posición superior del contenedor de sugerencias basada en la plataforma
  const searchSuggestionsTop = Platform.OS === 'ios' ? insets.top + 55 : insets.top + 65; // Ajusta 55 según la altura de tu Header

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        showBackButton={showBackButton}
        setShowBackButton={() => setShowBackButton(true)}
        onSearchChangeText={handleSearchChangeText}
        onSearchSubmit={handleSearchSubmit}
        onFocusSearch={handleFocusSearch}
        onBlurSearch={handleBlurSearch}
        onInternalBackPress={handleBlurSearch}
        filters={filtrosDisponibles}
        onFilterPress={handleFilterPress}
        onFilterButtonPress={handleFilterButtonPress}
      />
      {isSearchFocused && (
        <View style={[styles.searchSuggestionsContainer, { top: searchSuggestionsTop }]}>
          <View style={styles.recentSearches}>
            <Text style={styles.sectionTitle}>Productos Recientes</Text>
            {/* Aquí podrías mostrar búsquedas recientes */}
          </View>

          <View style={styles.popularSearches}>
            <Text style={styles.sectionTitle}>Los Más Buscados</Text>
            {/* Aquí podrías mostrar los más buscados */}
          </View>
        </View>
      )}

      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={navigateToAddProduct}>
        <Text style={styles.primaryButtonText}>+ Agregar Producto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryBackground,
  },
  searchSuggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  recentSearches: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryTextColor,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryTextColor,
  },
  itemDetails: {
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 16,
    color: secondaryTextColor,
  },
  itemUnit: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemPriceUSD: {
    fontSize: responsiveNormalTextFontSize,
    fontWeight: 'bold',
    color: erpGreen,
    marginBottom: 1,
  },
  itemPriceBS: {
    fontSize: responsiveNormalTextFontSize - 2,
    color: secondaryTextColor,
  },
  primaryButton: {
    backgroundColor: erpGreen,
    borderRadius: borderRadiusStandard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: marginBottomSmall,
    paddingVertical: buttonPaddingVertical,
    marginLeft: 16,
    marginRight: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveNormalTextFontSize + 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  popularSearches: {
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  loadingText: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: responsiveNormalTextFontSize,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default InventoryScreen;