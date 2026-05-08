// app/(tabs)/ventas.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateSaleScreen = () => {
  return (
    <View style={styles.salesContainer}>
      <Text>Nueva venta</Text>
    </View>
  );
};

export default CreateSaleScreen;

const styles = StyleSheet.create({
  salesContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  }
})