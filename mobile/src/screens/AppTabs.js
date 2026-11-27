import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarketScreen from '../screens/MarketScreen';
import SellScreen from '../screens/SellScreen';
import PlantingScreen from '../screens/PlantingScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';
import { useTheme } from '../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Newspaper, Sprout, Tag, TrendingUp, UserRound } from 'lucide-react-native';

const Tabs = createBottomTabNavigator();

export default function AppTabs({ user, onLogout, onLogin }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="Market" options={{ tabBarIcon: ({ color }) => <TrendingUp color={color} size={22} /> }}>
        {() => <MarketScreen user={user} />}
      </Tabs.Screen>
      <Tabs.Screen name="Planting" component={PlantingScreen} options={{ tabBarIcon: ({ color }) => <Sprout color={color} size={22} /> }} />
      <Tabs.Screen name="News" component={NewsScreen} options={{ tabBarIcon: ({ color }) => <Newspaper color={color} size={22} /> }} />
      {user ? (
        <>
          <Tabs.Screen name="Sell" component={SellScreen} options={{ tabBarIcon: ({ color }) => <Tag color={color} size={22} /> }} />
          <Tabs.Screen name="Profile" options={{ tabBarIcon: ({ color }) => <UserRound color={color} size={22} /> }}>
            {() => <ProfileScreen user={user} onLogout={onLogout} />}
          </Tabs.Screen>
        </>
      ) : (
        <Tabs.Screen name="Account" options={{ tabBarIcon: ({ color }) => <UserRound color={color} size={22} /> }}>
          {() => <AuthScreen onReady={onLogin} />}
        </Tabs.Screen>
      )}
    </Tabs.Navigator>
  );
}