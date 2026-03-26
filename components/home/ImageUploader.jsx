import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE, SHADOWS } from '../../constants/theme';

export default function ImageUploader({ onPickGallery, onTakePhoto }) {
  return (
    <View style={s.uploadBox}>
      <View style={s.uploadIconWrap}>
        <Text style={s.uploadIconText}>☁️</Text>
      </View>
      <Text style={s.uploadTitle}>Drop your image here</Text>
      <Text style={s.uploadHint}>
        Supports PNG, JPG and HEIC {'\n'}Best results with clear subjects.
      </Text>

      <TouchableOpacity style={s.galleryBtn} onPress={onPickGallery} activeOpacity={0.8}>
        <Text style={s.galleryBtnText}>Choose Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.cameraBtn} onPress={onTakePhoto} activeOpacity={0.8}>
        <Text style={s.cameraBtnText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  uploadBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  uploadIconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  uploadIconText: {
    fontSize: 28,
  },
  uploadTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  uploadHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  galleryBtn: {
    backgroundColor: COLORS.teal,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
  },
  galleryBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  cameraBtn: {
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cameraBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
