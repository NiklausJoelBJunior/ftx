import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function FormInput({ value, onChangeText, placeholder, secureTextEntry = false, label, keyboardType, autoCapitalize = 'none', error }) {
  const { scheme } = useTheme();
  const styles = makeStyles(scheme);
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        style={[styles.input, focused && styles.inputFocused, error && { borderColor: colors.danger }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: -6, marginBottom: 10, marginLeft: 2 }}>{error}</Text> : null}
    </View>
  );
}