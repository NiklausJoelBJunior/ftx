import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, Text, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function NewsDetailScreen({ route }) {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const [item, setItem] = useState(null);

  useEffect(() => {
    api(`/news/${route.params.id}`).then(setItem).catch((error) => Alert.alert('FTX', error.message));
  }, [route.params.id]);

  if (!item) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.green} />;
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
      {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={[styles.badgeText, { color: colors.muted, marginBottom: 16 }]}>{item.category}</Text>
      <Text style={{ lineHeight: 24, color: colors.text, fontSize: 15 }}>{item.content}</Text>
      {item.external_url ? (
        <TouchableOpacity onPress={() => Linking.openURL(item.external_url)} style={{ marginTop: 24 }}>
          <Text style={styles.link}>Read full article →</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}