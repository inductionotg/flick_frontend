import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import SkeletonLoader from '../SkeletonLoader';

export default function ResultCard({
  style,
  result,
  cardWidth,
  onImagePress,
  onRetry,
  onDownload,
  onShare,
  downloadingId,
}) {
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.styleName}>{style.name}</Text>
      </View>

      <View style={styles.imageContainer}>
        {!result || result.status === 'loading' ? (
          <SkeletonLoader width={cardWidth - 2} height={cardWidth - 2} borderRadius={0} />
        ) : result.status === 'error' ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorMessage} numberOfLines={6}>
              {result.error || 'Something went wrong'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.9} onPress={onImagePress}>
            <Image source={{ uri: result.imageUrl }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        )}
      </View>

      {result?.status === 'success' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onDownload}
            activeOpacity={0.7}
            disabled={downloadingId === style.name}
          >
            {downloadingId === style.name ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.actionText}>Save</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  styleName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  errorIcon: {
    fontSize: 24,
  },
  errorMessage: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: SPACING.sm,
    lineHeight: Math.round(FONT_SIZE.xs * 1.35),
  },
  retryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  retryText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
});
