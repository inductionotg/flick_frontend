import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import ComparisonSlider from './ComparisonSlider';

export default function ResultPreview({
  result,
  originalUri,
  hairstyleName,
  onSave,
  onShare,
  onRetry,
  onTryAnother,
  isSaving,
}) {
  if (!result) return null;

  if (result.status === 'loading') {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.teal} />
        <Text style={s.loadingText}>Generating {hairstyleName}...</Text>
        <Text style={s.loadingHint}>This may take up to 30 seconds</Text>
      </View>
    );
  }

  if (result.status === 'error') {
    return (
      <View style={s.errorContainer}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.error} />
        <Text style={s.errorText}>{result.error || 'Generation failed'}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color={COLORS.white} />
          <Text style={s.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.sectionTitle}>Result — {hairstyleName}</Text>

      <View style={s.resultImageWrap}>
        <Image source={{ uri: result.imageUrl }} style={s.resultImage} resizeMode="cover" />
      </View>

      <Text style={s.compareLabel}>Before / After</Text>
      <ComparisonSlider originalUri={originalUri} generatedUri={result.imageUrl} />

      <View style={s.actionRow}>
        <TouchableOpacity style={s.actionBtn} onPress={onSave} activeOpacity={0.8} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color={COLORS.teal} size="small" />
          ) : (
            <Ionicons name="download-outline" size={20} color={COLORS.teal} />
          )}
          <Text style={s.actionText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.actionBtn} onPress={onShare} activeOpacity={0.8}>
          <Ionicons name="share-outline" size={20} color={COLORS.teal} />
          <Text style={s.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.actionBtn} onPress={onTryAnother} activeOpacity={0.8}>
          <Ionicons name="swap-horizontal-outline" size={20} color={COLORS.teal} />
          <Text style={s.actionText}>Try Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  resultImageWrap: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  resultImage: {
    width: '100%',
    height: 340,
    borderRadius: RADIUS.lg,
  },
  compareLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.teal,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  loadingHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
  },
  retryBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
});
