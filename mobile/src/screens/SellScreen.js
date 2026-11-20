import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../components/FormInput';
import AppButton from '../components/AppButton';
import { api } from '../services/api';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function SellScreen() {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const [form, setForm] = useState({});
  const [mine, setMine] = useState([]);
  const [active, setActive] = useState([]);
  const [image, setImage] = useState(null);

  const load = () => Promise.all([api('/listings/mine'), api('/listings')])
    .then(([mineItems, activeItems]) => { setMine(mineItems); setActive(activeItems); })
    .catch((error) => Alert.alert('FTX', error.message));

  useEffect(load, []);

  const chooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('FTX', 'Photo permission is required');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const submit = async () => {
    try {
      const body = new FormData();
      Object.entries({ ...form, quantity: String(Number(form.quantity)), askingPrice: String(Number(form.askingPrice)) }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) body.append(key, String(value));
      });
      if (image) body.append('image', { uri: image.uri, name: 'listing.jpg', type: image.mimeType || 'image/jpeg' });
      await api('/listings', { method: 'POST', body });
      setForm({});
      setImage(null);
      load();
    } catch (error) {
      Alert.alert('FTX', error.message);
    }
  };

  const renderListing = (item, prefix) => (
    <View style={styles.card} key={`${prefix}-${item.id}`}>
      {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
      <Text style={styles.rowText}>{item.crop_name} · {item.quantity} {item.unit}</Text>
      <Text style={styles.muted}>{item.location} · ${item.asking_price}{item.status ? ` · ${item.status}` : ''}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Sell Crops" />
      <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>

      <Text style={styles.sectionTitle}>New listing</Text>
      <FormInput label="Crop name" value={form.cropName || ''} placeholder="e.g. Maize" onChangeText={(v) => setForm({ ...form, cropName: v })} />
      <FormInput label="Category" value={form.category || ''} placeholder="e.g. Cereal" onChangeText={(v) => setForm({ ...form, category: v })} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <FormInput label="Quantity" value={form.quantity || ''} placeholder="100" keyboardType="numeric" onChangeText={(v) => setForm({ ...form, quantity: v })} />
        </View>
        <View style={{ flex: 1 }}>
          <FormInput label="Unit" value={form.unit || ''} placeholder="kg" onChangeText={(v) => setForm({ ...form, unit: v })} />
        </View>
      </View>
      <FormInput label="Asking price ($)" value={form.askingPrice || ''} placeholder="0.00" keyboardType="numeric" onChangeText={(v) => setForm({ ...form, askingPrice: v })} />
      <FormInput label="Location" value={form.location || ''} placeholder="City, region" onChangeText={(v) => setForm({ ...form, location: v })} />

      {image ? <Image source={{ uri: image.uri }} style={styles.cardImage} /> : null}
      <AppButton title={image ? 'Change image' : 'Add listing image'} variant="secondary" onPress={chooseImage} />
      <AppButton title="Create listing" onPress={submit} />

      <Text style={styles.sectionTitle}>My listings</Text>
      {mine.length ? mine.map((item) => renderListing(item, 'mine')) : <Text style={styles.emptyText}>You haven't listed anything yet.</Text>}

      <Text style={styles.sectionTitle}>Active marketplace</Text>
      {active.length ? active.map((item) => renderListing(item, 'active')) : <Text style={styles.emptyText}>No active listings right now.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}