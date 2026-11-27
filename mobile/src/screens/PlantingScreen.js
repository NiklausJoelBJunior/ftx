import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useApiList } from '../services/useApiList';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function PlantingScreen() {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const { items } = useApiList('/planting-advisories');
  const [expandedId, setExpandedId] = useState(null);

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Planting Advisory" />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const avoid = item.recommendation === 'Avoid Planting';
          const expanded = expandedId === item.id;
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${item.crop_name} planting advisory details`}
              onPress={() => setExpandedId(expanded ? null : item.id)}
            >
              {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
              <View style={[styles.badge, avoid ? styles.badgeDanger : styles.badgeGreen, { marginBottom: 8 }]}>
                <Text style={[styles.badgeText, { color: avoid ? colors.danger : colors.green }]}>
                  {item.recommendation}
                </Text>
              </View>
              <Text style={styles.rowText}>{item.crop_name}</Text>
              <Text style={styles.muted}>{item.region} · {item.season}</Text>
              <Text style={styles.muted} numberOfLines={expanded ? undefined : 2}>{item.notes}</Text>
              {expanded ? (
                <View>
                  <Text style={styles.sectionTitle}>Growing guidance</Text>
                  <Text style={styles.rowText}>Planting window: {item.planting_window}</Text>
                  <Text style={styles.muted}>Region: {item.region}</Text>
                  <Text style={styles.muted}>Season: {item.season}</Text>
                  {item.current_temperature !== undefined ? (
                    <Text style={styles.muted}>Current temperature: {item.current_temperature}°C</Text>
                  ) : null}
                  <Text style={styles.muted}>Confirm timing with local weather and agricultural extension guidance.</Text>
                  <Text style={styles.link}>Tap to hide guidance</Text>
                </View>
              ) : (
                <Text style={styles.link}>Tap for planting guidance</Text>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyText}>No advisories published yet.</Text></View>}
      />
    </SafeAreaView>
  );
}