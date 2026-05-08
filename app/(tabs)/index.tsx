// homeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  primaryBackground, 
  primaryTextColor, 
  secondaryTextColor,
  gecko4,
  gecko5,
  gecko6,
  gecko7,
  gecko8,
  gecko3,
  gecko2,
  gecko1,
} from '../../constants/Colors';
import { responsiveNormalTextFontSize } from '../../constants/Fonts';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateToInventory = () => {
    router.push('/inventoryScreen');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        {/* Tarjeta Principal de Inventario */}
        <TouchableOpacity style={[styles.topCard, styles.card1]} onPress={navigateToInventory}>
          {/* <Image
            source={require('../assets/images/inventory-icon.png')} // Reemplaza con la ruta de tu imagen de inventario
            style={styles.inventoryImage}
            resizeMode="cover"
          /> */}
          <View 
            style={styles.topImage}
          >
            {/* <Text>.png-2</Text> */}
            <MaterialCommunityIcons name="sale" size={60} color={gecko7}/>
          </View>
          <View style={styles.topTextContainer}>
            <Text style={[styles.topTitle, styles.cardTitle1]}>Ventas</Text>
            <Text style={styles.topSubtitle}>Gestiona las ventas a clientes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.topCard, styles.card2]} onPress={navigateToInventory}>
          {/* <Image
            source={require('../assets/images/inventory-icon.png')} // Reemplaza con la ruta de tu imagen de inventario
            style={styles.inventoryImage}
            resizeMode="cover"
          /> */}
          <View 
            style={styles.topImage}
          >
            <MaterialCommunityIcons name="cart" size={60} color={gecko6} />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={[styles.topTitle, styles.cardTitle2]}>Compras</Text>
            <Text style={styles.topSubtitle}>Gestiona las compras a proveedores</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.otherCategoriesContainer}>
          <TouchableOpacity style={styles.otherCategoryCard}>
            <View>
              <MaterialCommunityIcons name="file-document-edit" size={35}/>
            </View>  
            <Text style={styles.otherCategoryTitle}>Facturas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherCategoryCard}>
            <View>
              <MaterialCommunityIcons name="account-group" size={35} color="peru" />
            </View>
            <Text style={styles.otherCategoryTitle}>Clientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherCategoryCard}>
            <View>
              {/* <Text>.png-6</Text> */}
              <MaterialCommunityIcons name="file-chart" size={35} />
            </View>
            <Text
              style={styles.otherCategoryTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >Reportes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherCategoryCard}>
            <View>
              <MaterialCommunityIcons name="office-building" size={35} />
            </View>
            <Text
              style={styles.otherCategoryTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >Proveedores</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryBackground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: responsiveNormalTextFontSize + 4,
    fontWeight: 'bold',
    color: primaryTextColor,
    marginTop: 20,
    marginBottom: 10,
  },
  topCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  card1: {
    backgroundColor: gecko5,
  },
  card2: {
    backgroundColor: gecko4,
  },
  topImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTextContainer: {
    flex: 1,
  },
  topTitle: {
    fontSize: responsiveNormalTextFontSize + 6,
    // fontWeight: 'bold',
  },
  cardTitle1: {
    color: gecko7,
  },
  cardTitle2: {
    color: gecko6,
  },
  topSubtitle: {
    fontSize: responsiveNormalTextFontSize,
    color: secondaryTextColor,
  },
  otherCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 20,
    justifyContent: 'space-between',
    width: '100%',
    overflow: 'scroll',
  },
  otherCategoryCard: {
    backgroundColor: gecko8,
    borderRadius: '30%',
    padding: 16,
    width: 95,
    height: 90,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  otherCategoryTitle: {
    fontSize: responsiveNormalTextFontSize,
    color: primaryTextColor,
    // fontWeight: 'bold',
  },
});

export default HomeScreen;