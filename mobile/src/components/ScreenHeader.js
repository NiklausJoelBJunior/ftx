import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';

export default function ScreenHeader({ title, subtitle, right }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 8),
        paddingHorizontal: 18,
        paddingBottom: 12,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>{title}</Text>
          {subtitle ? <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 3 }}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}
