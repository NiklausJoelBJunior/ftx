import AsyncStorage from '@react-native-async-storage/async-storage';

// For Expo on a physical phone, replace localhost with this computer's LAN IP:
// EXPO_PUBLIC_API_URL=http://192.168.1.20:4000/api
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function api(path, options = {}) {
  const token = await AsyncStorage.getItem('ftx_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}
export async function saveSession(data) { await AsyncStorage.setItem('ftx_token', data.token); await AsyncStorage.setItem('ftx_user', JSON.stringify(data.user)); }
export async function clearSession() { await AsyncStorage.multiRemove(['ftx_token', 'ftx_user']); }
