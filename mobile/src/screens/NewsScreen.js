import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { useApiList } from '../services/useApiList';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function NewsScreen({ navigation }) {
  const { scheme } = useTheme();
  const styles = makeStyles(scheme);
  const { items } = useApiList('/news');

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="Agricultural News" />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('NewsDetail', { id: item.id })} activeOpacity={0.75}>
            {item.image_url ? <Image source={{ uri: item.image_url }} style={styles.cardImage} /> : null}
            <Text style={styles.rowText}>{item.title}</Text>
            <Text style={styles.muted} numberOfLines={2}>{item.summary}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyText}>No news articles yet.</Text></View>}
      />
    </SafeAreaView>
  );
}