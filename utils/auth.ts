// utils/auth.ts
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';
const USER_ID_KEY = 'userId';

export interface User {
  id: string;
  username: string;
  password: string;
}

export const saveAuthToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
};

export const deleteAuthToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
};

export const saveUserId = async (userId: string): Promise<void> => {
  await SecureStore.setItemAsync(USER_ID_KEY, userId);
};

export const getUserId = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(USER_ID_KEY);
};

export const deleteUserId = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};

// Modificar la función getUser para verificar el token seguro
export const getUser = async (): Promise<string | null> => {
  const token = await getAuthToken();
  // Aquí hacer una llamada a backend para validar el token
  // Por ahora, simplemente devolvemos el token como indicativo de sesión
  return token;
};

export const saveUserCredentials = async (username: string, passwordHash: string): Promise<void> => {
  await saveSecureData('username', username);
  await saveSecureData('password', passwordHash);
};

export const getUserCredentials = async (): Promise<{ username: string | null; password: string | null }> => {
  const username = await getSecureData('username');
  const password = await getSecureData('password');
  return { username, password };
};

export const deleteUserCredentials = async (): Promise<void> => {
  await deleteSecureData('username');
  await deleteSecureData('password');
};

const saveSecureData = async (key: string, value: string): Promise<void> => {
  await SecureStore.setItemAsync(key, value);
};

const getSecureData = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

const deleteSecureData = async (key: string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};