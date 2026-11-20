import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarketScreen from '../screens/MarketScreen';
import SellScreen from '../screens/SellScreen';
import PlantingScreen from '../screens/PlantingScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';
import { useTheme } from '../ThemeContext';

const Tabs = createBottomTabNavigator();

export default function AppTabs({ user, onLogout, onLogin }) {
  const { colors } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="Market" component={MarketScreen} options={{ tabBarIcon: ({ color }) => <TabIcon label="M" color={color} /> }} />
      <Tabs.Screen name="Planting" component={PlantingScreen} options={{ tabBarIcon: ({ color }) => <TabIcon label="P" color={color} /> }} />
      <Tabs.Screen name="News" component={NewsScreen} options={{ tabBarIcon: ({ color }) => <TabIcon label="N" color={color} /> }} />
      {user ? (
        <>
          <Tabs.Screen name="Sell" component={SellScreen} options={{ tabBarIcon: ({ color }) => <TabIcon label="S" color={color} /> }} />
          <Tabs.Screen name="Profile" options={{ tabBarIcon: ({ color }) => <TabIcon label="U" color={color} /> }}>
            {() => <ProfileScreen user={user} onLogout={onLogout} />}
          </Tabs.Screen>
        </>
      ) : (
        <Tabs.Screen name="Account" options={{ tabBarIcon: ({ color }) => <TabIcon label="A" color={color} /> }}>
          {() => <AuthScreen onReady={onLogin} />}
        </Tabs.Screen>
      )}
    </Tabs.Navigator>
  );
}

// Simple placeholder icons keep the app dependency-light.
function TabIcon({ label, color }) {
  const { Text } = require('react-native');
  return <Text style={{ color, fontWeight: '800', fontSize: 16 }}>{label}</Text>;
}