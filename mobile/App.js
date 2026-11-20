import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from './src/components/AppLoading';
import AuthScreen from './src/screens/AuthScreen';
import AppTabs from './src/screens/AppTabs';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import { makeNavigationTheme } from './src/theme';
import { api, clearSession } from './src/services/api';

const Stack = createNativeStackNavigator();

function AppShell() {
  const { scheme } = useTheme();
  const navTheme = makeNavigationTheme(scheme);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('ftx_user')
      .then(async value => {
        if (!value) return setUser(null);
        try {
          const profile = await api('/auth/profile');
          setUser(profile);
          await AsyncStorage.setItem('ftx_user', JSON.stringify(profile));
        } catch {
          await clearSession();
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  if (loading) {
    return (
      <>
        <StatusBar barStyle={scheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={navTheme.colors.background} />
        <AppLoading />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={scheme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={navTheme.colors.background} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {() => <AppTabs user={user} onLogout={logout} onLogin={setUser} />}
          </Stack.Screen>
          <Stack.Screen
            name="NewsDetail"
            component={NewsDetailScreen}
            options={{
              title: 'News',
              headerStyle: { backgroundColor: navTheme.colors.card },
              headerTintColor: navTheme.colors.text,
              headerShadowVisible: false,
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}