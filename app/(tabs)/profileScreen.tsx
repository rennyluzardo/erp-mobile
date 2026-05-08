// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteAuthToken } from '../../utils/auth';
import { useDatabase } from '../_layout';
import { fetchUserByUsername } from '../../database/queries';
import { User } from '../../database/models/user';

const geckoGreen = '#25D366';
const textColorWhite = '#fff';

export default function ProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<User | null>(null);
  const database = useDatabase();

  useEffect(() => {
    const loadProfile = async () => {
      if (database) {
        const user = await fetchUserByUsername(database, "Renny");
        console.log('User data:', user);
        setProfileData(user);
      }
    };

    loadProfile();
  }, [database]);

  const handleLogout = async () => {
    await deleteAuthToken();
    router.replace('/(auth)/loginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {profileData ? (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{profileData?.username || 'N/A'}</Text>
        </View>
      ) : (
        <Text>Cargando perfil...</Text>
      )}
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogout}>
        <Text style={styles.primaryButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  profileInfo: {
    width: '80%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: geckoGreen,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  primaryButtonText: {
    color: textColorWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});