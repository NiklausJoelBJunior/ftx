import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { makeStyles } from '../styles';
import { useTheme } from '../ThemeContext';

export default function AppLoading() {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  return (
    <View style={styles.center}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}
