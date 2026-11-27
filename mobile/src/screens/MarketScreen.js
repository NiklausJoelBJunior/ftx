import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../components/ScreenHeader';
import { useApiList } from '../services/useApiList';
import { api } from '../services/api';
import AppButton from '../components/AppButton';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function MarketScreen({ user }) {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const { items } = useApiList('/market-prices');
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [expandedPriceId, setExpandedPriceId] = useState(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    api('/listings')
      .then(listingItems => { if (active) setListings(listingItems); })
      .catch(error => Alert.alert('FTX', error.message))
      .finally(() => { if (active) setLoadingListings(false); });
    return () => { active = false; };
  }, []));

  const buy = async (listing) => {
    if (!user) {
      Alert.alert('Sign in required', 'Sign in to contact the seller.');
      return;
    }
    try {
      const seller = await api(`/listings/${listing.id}/seller`);
      Alert.alert(
        'Contact seller',
        `Contact ${seller.name} to arrange your purchase.\n\nEmail: ${seller.email}\nPhone: ${seller.phone || 'Not provided'}`,
      );
    } catch (error) {
      Alert.alert('FTX', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Market Prices" />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 32 }}
        ListHeaderComponent={
          <View>
            <Text style={styles.sectionTitle}>Buy from farmers</Text>
            {listings.map(listing => (
              <View style={styles.card} key={`listing-${listing.id}`}>
                {listing.image_url ? <Image source={{ uri: listing.image_url }} style={styles.cardImage} /> : null}
                <Text style={styles.rowText}>{listing.crop_name} · {listing.quantity} {listing.unit}</Text>
                <Text style={styles.muted}>{listing.category} · {listing.location}</Text>
                <Text style={styles.rowText}>
                  ${listing.asking_price} / {listing.unit}
                </Text>
                {String(listing.user_id) === String(user?.id) ? (
                  <Text style={styles.muted}>Your listing</Text>
                ) : (
                  <AppButton title="Buy" onPress={() => buy(listing)} />
                )}
              </View>
            ))}
            {!listings.length && !loadingListings ? (
              <Text style={styles.emptyText}>No active farmer listings right now.</Text>
            ) : null}
            <Text style={styles.sectionTitle}>Market prices</Text>
          </View>
        }
        renderItem={({ item }) => {
          const expanded = expandedPriceId === item.id;
          const trend = item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Steady';
          const trendStyle = item.trend === 'up' ? styles.badgeGreen : item.trend === 'down' ? styles.badgeDanger : styles.badge;
          const trendColor = item.trend === 'up' ? colors.green : item.trend === 'down' ? colors.danger : colors.muted;
          const updatedAt = item.updated_at ? new Date(item.updated_at).toLocaleString() : 'Not available';
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${item.crop_name} market price details`}
              onPress={() => setExpandedPriceId(expanded ? null : item.id)}
            >
              {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
              <View style={styles.rowBetween}>
                <Text style={styles.rowText}>{item.crop_name}</Text>
                <View style={[styles.badge, trendStyle]}>
                  <Text style={[styles.badgeText, { color: trendColor }]}>
                    {item.trend === 'up' ? '▲ Rising' : item.trend === 'down' ? '▼ Falling' : '● Steady'}
                  </Text>
                </View>
              </View>
              <Text style={styles.muted}>{item.category} · {item.source || 'Market feed'}</Text>
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
              {expanded ? (
                <View>
                  <Text style={styles.sectionTitle}>Price movement</Text>
                  <Text style={styles.rowText}>{trend} trend recorded</Text>
                  <Text style={styles.muted}>Buying price: ${item.buying_price} per {item.unit}</Text>
                  <Text style={styles.muted}>Selling price: ${item.selling_price} per {item.unit}</Text>
                  <Text style={styles.muted}>Market: {item.location || 'Location not provided'}</Text>
                  <Text style={styles.muted}>Source: {item.source || 'Market feed'}</Text>
                  <Text style={styles.muted}>Last updated: {updatedAt}</Text>
                  <Text style={styles.muted}>Trend direction is supplied by the feed; historical price points are not available here.</Text>
                  <Text style={styles.muted}>Tap to hide details</Text>
                </View>
              ) : (
                <Text style={styles.link}>Tap to view price and trend details</Text>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No market prices available yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}