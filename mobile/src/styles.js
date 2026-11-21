import { StyleSheet } from 'react-native';
import { getColors, spacing, radius } from './theme';

export const makeStyles = (scheme) => {
  const colors = getColors(scheme);
  return StyleSheet.create({
    // Layout
    page: { flex: 1, backgroundColor: colors.background },
    screen: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    headerPad: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },

    // Text
    title: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5, marginBottom: spacing.md },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.lg },
    sectionTitle: {
      fontSize: 12, fontWeight: '700', color: colors.muted,
      letterSpacing: 1, textTransform: 'uppercase',
      marginTop: spacing.xl, marginBottom: spacing.sm,
    },
    rowText: { color: colors.text, fontSize: 15, fontWeight: '600' },
    muted: { color: colors.textSecondary, fontSize: 13, marginTop: 4, lineHeight: 18 },
    link: { marginTop: spacing.lg, color: colors.green, fontWeight: '600', fontSize: 14 },

    // Surfaces
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%', height: 160,
      marginBottom: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surface2,
    },
    divider: { height: 1, backgroundColor: colors.border },

    // Inputs
    input: {
      backgroundColor: colors.surface2,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      marginBottom: spacing.md,
      fontSize: 15,
    },
    inputFocused: {
      borderColor: colors.green,
      backgroundColor: colors.surface,
    },
    inputLabel: {
      fontSize: 12, fontWeight: '600', color: colors.textSecondary,
      marginBottom: 6, marginLeft: 2,
    },

    // Buttons
    button: {
      backgroundColor: colors.green,
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSecondary: {
      backgroundColor: colors.surface2,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    buttonGhost: {
      paddingVertical: 12,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    buttonDanger: {
      backgroundColor: colors.danger,
      paddingVertical: 14,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
    buttonTextSecondary: { color: colors.text, fontSize: 15, fontWeight: '600' },
    buttonTextGhost: { color: colors.green, fontSize: 15, fontWeight: '600' },

    // Badges
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radius.pill,
      backgroundColor: colors.surface2,
    },
    badgeGreen: { backgroundColor: colors.greenMuted },
    badgeDanger: { backgroundColor: 'rgba(239,68,68,0.15)' },
    badgeText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.3 },

    // Helpers
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    gap8: { gap: 8 },
    gap12: { gap: 12 },
    flex1: { flex: 1 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
    emptyText: { color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  });
};