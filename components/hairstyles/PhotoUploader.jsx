import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function PhotoUploader({
  imageUri,
  isProcessing,
  onPickGallery,
  onTakePhoto,
  onRemove,
}) {
  if (imageUri) {
    return (
      <View style={s.previewContainer}>
        <Image source={{ uri: imageUri }} style={s.previewImage} resizeMode="cover" />
        {isProcessing && (
          <View style={s.processingOverlay}>
            <ActivityIndicator color={COLORS.teal} size="large" />
          </View>
        )}
        <TouchableOpacity style={s.removeBtn} onPress={onRemove} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={28} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.uploadContainer}>
      <Ionicons name="person-circle-outline" size={48} color={COLORS.textMuted} />
      <Text style={s.uploadTitle}>Upload your photo</Text>
      <Text style={s.uploadHint}>Clear, front-facing photo works best</Text>
      <View style={s.btnRow}>
        <TouchableOpacity style={s.uploadBtn} onPress={onPickGallery} activeOpacity={0.8}>
          <Ionicons name="images-outline" size={20} color={COLORS.white} />
          <Text style={s.uploadBtnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.uploadBtn} onPress={onTakePhoto} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={20} color={COLORS.white} />
          <Text style={s.uploadBtnText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  uploadContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  uploadTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  uploadHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  uploadBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  previewContainer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 280,
    borderRadius: RADIUS.lg,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
  removeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
});
