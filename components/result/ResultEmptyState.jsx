import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function ResultEmptyState({ onGoHome }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>✨</Text>
      <Text style={styles.emptyTitle}>No results yet</Text>
      <Text style={styles.emptyText}>
        On the Home tab, upload a photo, choose styles, then tap Generate. Your clipart will show
        up on this tab.
      </Text>
      <TouchableOpacity style={styles.emptyCta} onPress={onGoHome} activeOpacity={0.85}>
        <Text style={styles.emptyCtaText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  emptyCta: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
  },
  emptyCtaText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});
