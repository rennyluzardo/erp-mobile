// scannerScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import ProductScanner from '../../components/ProductScanner';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const primaryColor = '#25D366';
const dragButtonHeight = 50;

interface ScannedProduct {
  barcode: string;
  name: string;
  priceBs: string;
  priceUsd: string;
}

export default function ScannerScreen() {
  const initialDragYValue = height * 0.75 - dragButtonHeight / 2;
  const minDragY = dragButtonHeight / 2;
  const maxDragY = height - dragButtonHeight / 2 - 50;

  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const dragY = useRef(new Animated.Value(initialDragYValue)).current;
  const lastDragY = useRef(initialDragYValue);

  const handleBarcodeScanned = useCallback((barcodeData: string) => {
    console.log('Escaneado:', barcodeData);
    const newProduct: ScannedProduct = {
      barcode: barcodeData,
      name: `Carne molida`,
      priceBs: '1.000.000,00',
      priceUsd: '800,00',
    };
    setScannedProducts((prevProducts) => [...prevProducts, newProduct]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store current value when drag starts
        dragY.stopAnimation((value) => {
          lastDragY.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.max(minDragY, Math.min(maxDragY, lastDragY.current + gestureState.dy));
        dragY.setValue(newY);
      },
      onPanResponderRelease: () => {
        dragY.stopAnimation((currentValue) => {
          const snapThresholdTop = height * 0.25;
          const snapThresholdBottom = height * 0.75;

          let toValue = currentValue;
          if (currentValue < snapThresholdTop) {
            toValue = minDragY;
          } else if (currentValue > snapThresholdBottom) {
            toValue = maxDragY;
          }

          Animated.spring(dragY, {
            toValue,
            useNativeDriver: false,
          }).start();
        });
      },
    })
  ).current;

  // Derived animated values
  const scannerHeight = dragY;
  const dragButtonTranslateY = Animated.subtract(dragY, dragButtonHeight / 2);
  const productListHeight = Animated.subtract(height - dragButtonHeight / 2, dragY);
  const productListTop = Animated.add(dragY, dragButtonHeight / 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva venta</Text>
        <View />
      </View>

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#777" style={styles.searchIcon} />
        <Text style={styles.searchInput}>Buscar producto...</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color="#333" />
          <Text style={styles.filterText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.categoryBar}>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Carnes</Text></TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Frutas</Text></TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Hortalizas</Text></TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Embutidos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Panadería</Text></TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Dulces</Text></TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryText}>Papelería</Text></TouchableOpacity>
      </ScrollView>

      <Animated.View style={[styles.scannerContainerAnimated, { height: scannerHeight }]}>
        <View style={styles.scannerWrapper}>
          <ProductScanner onBarcodeScanned={handleBarcodeScanned} />
        </View>
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.dragButtonContainer, {
          transform: [{ translateY: dragButtonTranslateY as any }],
          height: dragButtonHeight,
          width: width,
          backgroundColor: primaryColor,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        }]}
      >
        <View style={styles.dragButton}>
          <Feather name="chevron-up" size={30} color="white" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.productListContainerAnimated, {
        height: productListHeight as any,
        top: productListTop as any,
      }]}>
        <ScrollView ref={scrollViewRef} style={styles.productListScroll}>
          {scannedProducts.map((product, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.listItemImagePlaceholder} />
                <View>
                  <Text style={styles.listItemName}>{product.name}</Text>
                  <Text style={styles.listItemPrice}>{product.priceBs} Bs</Text>
                  <Text style={styles.listItemPriceDollar}>{product.priceUsd} $</Text>
                </View>
              </View>
              <View style={styles.listItemRight}>
                <TouchableOpacity style={styles.listItemRemove}>
                  <Feather name="trash-2" size={20} color="#777" />
                </TouchableOpacity>
                <View style={styles.listItemQuantity}>
                  <Text style={styles.listItemQuantityText}>2</Text>
                </View>
              </View>
            </View>
          ))}
          {scannedProducts.length === 0 && (
            <Text style={styles.emptyListText}>Escanea productos para agregarlos a la lista.</Text>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#777',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  filterText: {
    marginLeft: 5,
    color: '#333',
  },
  categoryBar: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 15,
  },
  categoryText: {
    color: '#333',
  },
  productListContainerAnimated: {
    width: '100%',
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
  },
  productListScroll: {
    paddingHorizontal: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemImagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listItemPrice: {
    fontSize: 14,
    color: '#777',
  },
  listItemPriceDollar: {
    fontSize: 14,
    color: primaryColor,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemRemove: {
    marginRight: 15,
  },
  listItemQuantity: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  listItemQuantityText: {
    color: '#333',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  dragButtonContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragButton: {
    height: 50,
    width: '100%',
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainerAnimated: {
    width: '100%',
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
  },
  scannerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});