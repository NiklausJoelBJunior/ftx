import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import FormInput from '../components/FormInput';
import AppButton from '../components/AppButton';
import { api, saveSession } from '../services/api';
import { useTheme } from '../ThemeContext';
import { makeStyles } from '../styles';

export default function AuthScreen({ onReady }) {
  const { scheme, colors } = useTheme();
  const styles = makeStyles(scheme);
  const [loginMode, setLoginMode] = useState(true);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const submit = async () => {
    setAuthError('');
    setSubmitting(true);
    try {
      const data = await api(`/auth/${loginMode ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(form) });
      await saveSession(data);
      onReady(data.user);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScreenHeader title="FTX" subtitle={loginMode ? 'Farmer account' : 'Create your account'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: colors.green, letterSpacing: -1 }}>FTX</Text>
            <Text style={[styles.title, { marginBottom: 6, marginTop: 8 }]}>
              {loginMode ? 'Welcome back' : 'Create account'}
            </Text>
            <Text style={styles.subtitle}>
              {loginMode ? 'Sign in to access market prices, advisories and listings.' : 'Join the farming marketplace and advisory network.'}
            </Text>
          </View>

          {!loginMode && (
            <FormInput label="Full name" placeholder="e.g. Jane Doe" value={form.name || ''} onChangeText={(name) => setForm({ ...form, name })} />
          )}
          <FormInput label="Email" placeholder="you@example.com" value={form.email || ''} onChangeText={(email) => setForm({ ...form, email })} keyboardType="email-address" />
          <FormInput label="Password" placeholder="••••••••" value={form.password || ''} secureTextEntry onChangeText={(password) => setForm({ ...form, password })} />

          {authError ? (
            <View style={{ backgroundColor: 'rgba(239,68,68,0.12)', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' }}>
              <Text style={{ color: colors.danger, fontSize: 13 }}>{authError}</Text>
            </View>
          ) : null}

          <AppButton title={loginMode ? 'Log in' : 'Create account'} onPress={submit} loading={submitting} />

          <TouchableOpacity onPress={() => { setLoginMode(!loginMode); setAuthError(''); }} style={{ marginTop: 18, alignItems: 'center' }}>
            <Text style={styles.link}>
              {loginMode ? "Don't have an account? " : 'Already registered? '}
              <Text style={{ color: colors.green, fontWeight: '700' }}>{loginMode ? 'Register' : 'Log in'}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}