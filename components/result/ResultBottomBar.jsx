import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function ResultBottomBar({ isGenerating, onNewImage }) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={[styles.newButton, isGenerating && styles.newButtonDisabled]}
        onPress={onNewImage}
        activeOpacity={0.8}
        disabled={isGenerating}
        accessibilityState={{ disabled: isGenerating }}
        accessibilityHint={
          isGenerating
            ? 'Available when all styles finish generating'
            : 'Start over with a new photo on Home'
        }
      >
        <Text style={[styles.newButtonText, isGenerating && styles.newButtonTextDisabled]}>
          New Image
        </Text>
      </TouchableOpacity>
      {isGenerating ? (
        <Text style={styles.newButtonCaption}>
          Wait until generation finishes, or use ← Home to go back.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  newButton: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newButtonDisabled: {
    opacity: 0.45,
  },
  newButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  newButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  newButtonCaption: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
});
