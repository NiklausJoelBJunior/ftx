import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function AppButton({ title, onPress, variant = 'primary', loading = false, disabled = false }) {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);

  const styleMap = {
    primary: styles.button,
    secondary: styles.buttonSecondary,
    ghost: styles.buttonGhost,
    danger: styles.buttonDanger,
  };
  const textMap = {
    primary: styles.buttonText,
    secondary: styles.buttonTextSecondary,
    ghost: styles.buttonTextGhost,
    danger: styles.buttonText,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styleMap[variant], { opacity: pressed || disabled ? 0.7 : 1, marginBottom: 10 }]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.green} />
      ) : (
        <Text style={textMap[variant]}>{title}</Text>
      )}
    </Pressable>
  );
}