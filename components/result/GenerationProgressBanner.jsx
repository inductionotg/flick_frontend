import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function GenerationProgressBanner({ generationProgress, jokeText }) {
  const indeterminateAnim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const { done, total, fraction } = generationProgress;
  const percent = Math.round(Math.max(0, Math.min(100, fraction * 100)));
  const isIndeterminate = done === 0;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(indeterminateAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminateAnim]);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: fraction,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [fraction, fillAnim]);

  const indeterminateLeft = trackWidth > 0
    ? indeterminateAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, trackWidth * 0.65, 0],
      })
    : 0;

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.jokeBanner}>
      <View style={styles.progressHeader}>
        <View style={styles.progressHeaderText}>
          <Text style={styles.progressTitle}>Creating your clipart</Text>
          <Text style={styles.progressSub}>
            {done === 0
              ? `Starting ${total} style${total !== 1 ? 's' : ''}…`
              : `${done} of ${total} finished`}
          </Text>
        </View>
        {!isIndeterminate && (
          <Text style={styles.percentText}>{percent}%</Text>
        )}
      </View>

      <View
        style={styles.progressTrack}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        {isIndeterminate ? (
          <Animated.View
            style={[
              styles.indeterminateFill,
              { left: indeterminateLeft },
            ]}
          />
        ) : (
          <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
        )}
      </View>

      <View style={styles.jokeSection}>
        <Text style={styles.jokeLabel}>While you wait</Text>
        <Text style={styles.jokeText}>{jokeText}</Text>
      </View>
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
    justifyContent: 'space-between',
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
  percentText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.teal,
    marginLeft: SPACING.sm,
  },
  progressTrack: {
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: COLORS.teal,
  },
  indeterminateFill: {
    height: '100%',
    width: '35%',
    borderRadius: 7,
    backgroundColor: COLORS.teal,
    position: 'absolute',
  },
  jokeSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
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
