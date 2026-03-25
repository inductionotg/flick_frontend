import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function GenerationProgressBanner({ generationProgress, jokeText }) {
  return (
    <View style={styles.jokeBanner}>
      <View style={styles.progressHeader}>
        <ActivityIndicator size="small" color={COLORS.teal} />
        <View style={styles.progressHeaderText}>
          <Text style={styles.progressTitle}>Creating your clipart</Text>
          <Text style={styles.progressSub}>
            {generationProgress.done === 0
              ? `Starting ${generationProgress.total} style${generationProgress.total !== 1 ? 's' : ''}…`
              : `${generationProgress.done} of ${generationProgress.total} finished`}
          </Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(0, Math.min(100, generationProgress.fraction * 100))}%`,
            },
          ]}
        />
      </View>
      <Text style={styles.jokeLabel}>While you wait</Text>
      <Text style={styles.jokeText}>{jokeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  jokeBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  progressHeaderText: {
    flex: 1,
  },
  progressTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  progressSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.teal,
  },
  jokeLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
  },
  jokeText: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
