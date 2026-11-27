import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { useCurrency } from '../CurrencyContext';

export default function CurrencyPicker({ compact = false }) {
  const { colors } = useTheme();
  const { currency, currencies, selectCurrency } = useCurrency();
  const [visible, setVisible] = useState(false);
  const selectedCurrency = currencies.find(item => item.code === currency);

  return (
    <>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Change currency, currently ${currency}`}
        onPress={() => setVisible(true)}
        style={compact ? {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface2,
        } : {
          padding: 14,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface2,
          marginBottom: 8,
        }}
      >
        {compact ? (
          <>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{currency}</Text>
            <ChevronDown size={16} color={colors.textSecondary} />
          </>
        ) : (
          <>
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              {currency} · {selectedCurrency?.name}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Tap to change display currency</Text>
          </>
        )}
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <View style={{ maxHeight: '80%', borderRadius: 16, padding: 18, backgroundColor: colors.surface }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Choose currency</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={{ color: colors.green, fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {currencies.map(item => {
                const active = currency === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    onPress={async () => {
                      try {
                        await selectCurrency(item.code);
                        setVisible(false);
                      } catch (error) {
                        Alert.alert('FTX', error.message);
                      }
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ color: colors.text }}>{item.name}</Text>
                    <Text style={{ color: active ? colors.green : colors.textSecondary, fontWeight: '700' }}>{item.code}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
