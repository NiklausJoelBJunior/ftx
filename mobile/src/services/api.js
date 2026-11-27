import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const localHost = expoHost || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const defaultApiUrl = __DEV__
  ? `http://${localHost}:4000/api`
  : 'https://ftx-e7l3.onrender.com/api';

export const API_URL = process.env.FTX_API_URL || defaultApiUrl;
export async function api(path, options = {}) {
  const token = await AsyncStorage.getItem('ftx_token');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = isFormData
      ? { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
      : { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers,
    });
    const text = await response.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { throw new Error('The server returned an invalid response'); }
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Login timed out. Check that the phone can reach the API.');
    if (error.message?.includes('Network request failed')) throw new Error(`Cannot reach API at ${API_URL}`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
export async function saveSession(data) { await AsyncStorage.setItem('ftx_token', data.token); await AsyncStorage.setItem('ftx_user', JSON.stringify(data.user)); }
export async function clearSession() { await AsyncStorage.multiRemove(['ftx_token', 'ftx_user']); }
