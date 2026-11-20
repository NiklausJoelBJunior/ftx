import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useApiList } from '../services/useApiList';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function PlantingScreen() {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const { items } = useApiList('/planting-advisories');

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Planting Advisory" />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const avoid = item.recommendation === 'Avoid Planting';
          return (
            <View style={styles.card}>
              {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
              <View style={[styles.badge, avoid ? styles.badgeDanger : styles.badgeGreen, { marginBottom: 8 }]}>
                <Text style={[styles.badgeText, { color: avoid ? colors.danger : colors.green }]}>
                  {item.recommendation}
                </Text>
              </View>
              <Text style={styles.rowText}>{item.crop_name}</Text>
              <Text style={styles.muted}>{item.region} · {item.planting_window}</Text>
              {item.notes ? <Text style={{ color: colors.textSecondary, marginTop: 8, fontSize: 13, lineHeight: 19 }}>{item.notes}</Text> : null}
            </View>
          );
        }}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyText}>No advisories published yet.</Text></View>}
      />
    </SafeAreaView>
  );
}