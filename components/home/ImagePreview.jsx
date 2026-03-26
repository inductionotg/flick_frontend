import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { getFileSizeLabel } from '../../services/imageUtils';

export default function ImagePreview({
  imageUri,
  compressedUri,
  originalSize,
  compressedSize,
  isProcessing,
  onRemove,
}) {
  return (
    <View style={s.previewSection}>
      <View style={s.previewHeader}>
        <Text style={s.previewLabel}>Preview</Text>
        <View style={s.previewMeta}>
          <Text style={s.sizeText}>
            {getFileSizeLabel(originalSize)} → {getFileSizeLabel(compressedSize)}
          </Text>
          <TouchableOpacity onPress={onRemove}>
            <Text style={s.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.previewCard}>
        {isProcessing ? (
          <View style={s.processingWrap}>
            <ActivityIndicator size="large" color={COLORS.teal} />
            <Text style={s.processingText}>Compressing...</Text>
          </View>
        ) : (
          <Image
            source={{ uri: compressedUri || imageUri }}
            style={s.previewImage}
            resizeMode="contain"
            {...(Platform.OS === 'android' ? { resizeMethod: 'scale' } : {})}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  previewSection: {
    marginBottom: SPACING.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  previewLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  sizeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  removeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  processingWrap: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  processingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
});
