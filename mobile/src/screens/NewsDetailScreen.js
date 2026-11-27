import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function NewsDetailScreen({ route }) {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api(`/news/${route.params.id}`)
      .then(article => { if (active) setItem(article); })
      .catch(error => Alert.alert('FTX', error.message))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [route.params.id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.green} />;
  }
  if (!item) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>This article could not be loaded. Please try again later.</Text>
      </View>
    );
  }

  const publishedAt = item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Date unavailable';
  const openSource = async () => {
    try {
      await Linking.openURL(item.external_url);
    } catch (error) {
      Alert.alert('FTX', `Could not open the publisher article: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
      {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={[styles.badgeText, { color: colors.muted, marginBottom: 16 }]}>
        {[item.source, item.category, publishedAt].filter(Boolean).join(' · ')}
      </Text>
      {item.summary && item.summary !== item.content ? <Text style={styles.subtitle}>{item.summary}</Text> : null}
      <Text style={{ lineHeight: 24, color: colors.text, fontSize: 15 }}>{item.content || item.summary}</Text>
      {item.external_url ? (
        <TouchableOpacity onPress={openSource} style={{ marginTop: 24 }} accessibilityRole="link">
          <Text style={styles.link}>Open full article at publisher →</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}