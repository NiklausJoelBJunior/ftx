import { useColorScheme } from 'react-native';

const lightColors = {
  background: '#f6f8f6',
  surface: '#ffffff',
  surface2: '#eef2ee',
  surfaceElevated: '#ffffff',
  green: '#16a34a',
  greenDark: '#15803d',
  greenMuted: '#dcfce7',
  text: '#0f172a',
  textSecondary: '#475569',
  muted: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  danger: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',
  overlay: 'rgba(0,0,0,0.04)',
  shadow: '#0f172a',
};

const darkColors = {
  background: '#090d0a',
  surface: '#151b17',
  surface2: '#1d251f',
  surfaceElevated: '#232d26',
  green: '#22c55e',
  greenDark: '#166534',
  greenMuted: '#14532d',
  text: '#f4f7f5',
  textSecondary: '#c7cfc9',
  muted: '#a1aaa4',
  border: '#303b34',
  borderLight: '#3d4a41',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  overlay: 'rgba(255,255,255,0.04)',
  shadow: '#000000',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 10, lg: 14, xl: 20, pill: 999 };

export const getColors = (scheme) => (scheme === 'light' ? lightColors : darkColors);

export const makeTypography = (colors) => ({
  h1: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.text, lineHeight: 22 },
  bodyMuted: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  caption: { fontSize: 12, color: colors.muted, letterSpacing: 0.2 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});

export const makeNavigationTheme = (scheme) => {
  const c = getColors(scheme);
  return {
    dark: scheme !== 'light',
    colors: {
      primary: c.green,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.green,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  };
};