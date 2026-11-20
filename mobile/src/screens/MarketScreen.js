import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useApiList } from '../services/useApiList';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function MarketScreen() {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const { items } = useApiList('/market-prices');

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Market Prices" />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const up = item.trend !== 'down';
          return (
            <View style={styles.card}>
              {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
              <View style={styles.rowBetween}>
                <Text style={styles.rowText}>{item.crop_name}</Text>
                <View style={[styles.badge, up ? styles.badgeGreen : styles.badgeDanger]}>
                  <Text style={[styles.badgeText, { color: up ? colors.green : colors.danger }]}>
                    {up ? '▲ Up' : '▼ Down'}
                  </Text>
                </View>
              </View>
              <Text style={styles.muted}>{item.category}</Text>
              <View style={[styles.row, { marginTop: 10, gap: 16 }]}>
                <View>
                  <Text style={{ fontSize: 11, color: colors.muted, fontWeight: '700', letterSpacing: 0.5 }}>BUY</Text>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>${item.buying_price}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: colors.muted, fontWeight: '700', letterSpacing: 0.5 }}>SELL</Text>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>${item.selling_price}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: colors.muted, fontWeight: '700', letterSpacing: 0.5 }}>UNIT</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: '600' }}>{item.unit}</Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No market data available yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}