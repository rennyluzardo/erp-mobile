// app/(tabs)/ventas.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Splash from '../../components/Splash'

const Auth = () => {
  return (
    <View style={styles.salesContainer}>
      <Splash/>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  salesContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  }
})