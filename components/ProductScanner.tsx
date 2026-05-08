import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Button } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Sounds from '../constants/Sounds';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

interface ScannerScreenProps {
  onBarcodeScanned: (data: string) => void;
}

export default function ProductScanner({ onBarcodeScanned }: ScannerScreenProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

  const handleBarcodeScanned = ({ type, data }: any) => {
    if (isScanning) {
      setIsScanning(false); // Evita escaneos múltiples rápidos
      _playBeep();
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      onBarcodeScanned(data);

      // Puedes decidir si quieres detener la escaneo inmediatamente o permitir más escaneos
      // Si quieres permitir más escaneos, podrías agregar un botón para "Listo" o un temporizador para resetear `isScanning`
    }
  };

  async function _playBeep() {
    try {
      const { sound } = await Audio.Sound.createAsync(Sounds.POS.barcodeScannerBeep);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Se necesita permiso para la cámara</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'aztec',
            'ean13',
            'ean8',
            'qr',
            'pdf417',
            'upc_e',
            'datamatrix',
            'code39',
            'code93',
            'itf14',
            'codabar',
            'code128',
            'upc_a',
          ],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%', // Altura fija para el escáner
    borderRadius: 10,
    overflow: 'hidden',
    // backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 10,
  },
});