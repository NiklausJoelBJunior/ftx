import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import FormInput from '../components/FormInput';
import AppButton from '../components/AppButton';
import { api } from '../services/api';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function ProfileScreen({ user, onLogout }) {
  const { scheme, colors, mode, setThemeMode } = useTheme();
  const styles = makeStyles(scheme);
  const [form, setForm] = useState(user || {});

  const chooseImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.didCancel) return;
    if (result.errorCode) return Alert.alert('FTX', result.errorMessage || 'Could not select an image');
    if (result.assets?.[0]) {
      const body = new FormData();
      body.append('image', { uri: result.assets[0].uri, name: 'profile.jpg', type: result.assets[0].type || 'image/jpeg' });
      try {
        const updated = await api('/uploads/profile', { method: 'POST', body });
        setForm(updated);
        Alert.alert('FTX', 'Profile image updated');
      } catch (error) {
        Alert.alert('FTX', error.message);
      }
    }
  };

  const save = async () => {
    try {
      const updated = await api('/auth/profile', { method: 'PUT', body: JSON.stringify({ ...form, farmArea: form.farm_area }) });
      setForm(updated);
      Alert.alert('FTX', 'Profile updated');
    } catch (error) {
      Alert.alert('FTX', error.message);
    }
  };

  const themeOptions = [
    { key: 'system', label: 'System' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Profile" />
      <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>

      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        {form.profile_image_url ? (
          <Image source={{ uri: form.profile_image_url }} style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: colors.border }} />
        ) : (
          <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border }}>
            <Text style={{ fontSize: 36, color: colors.muted }}>{(form.name || 'U').charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <TouchableOpacity onPress={chooseImage} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.green, fontWeight: '600', fontSize: 14 }}>Change photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Account details</Text>
      <FormInput label="Full name" value={form.name || ''} placeholder="Your name" onChangeText={(value) => setForm({ ...form, name: value })} />
      <FormInput label="Phone" value={form.phone || ''} placeholder="+1 555 000 0000" onChangeText={(value) => setForm({ ...form, phone: value })} keyboardType="phone-pad" />
      <FormInput label="Location" value={form.location || ''} placeholder="City, region" onChangeText={(value) => setForm({ ...form, location: value })} />
      <FormInput label="Farm area" value={form.farm_area || ''} placeholder="e.g. 5 hectares" onChangeText={(value) => setForm({ ...form, farm_area: value })} />
      <AppButton title="Save profile" onPress={save} />

      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {themeOptions.map((opt) => {
          const active = mode === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setThemeMode(opt.key)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: active ? colors.green : colors.border,
                backgroundColor: active ? colors.greenMuted : colors.surface2,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: active ? colors.green : colors.textSecondary, fontWeight: '600', fontSize: 13 }}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 24 }}>
        <AppButton title="Log out" variant="danger" onPress={onLogout} />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}