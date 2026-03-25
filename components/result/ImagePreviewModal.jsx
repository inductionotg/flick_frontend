import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT_SIZE, SHADOWS } from '../../constants/theme';
import { SCREEN_WIDTH } from './layout';
import { styleEmoji } from './styleEmoji';

export default function ImagePreviewModal({
  visible,
  selectedImage,
  onClose,
  onSaveToGallery,
  onShare,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {selectedImage ? `${styleEmoji(selectedImage.style)} ${selectedImage.style.name}` : ''}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <>
              <Image
                source={{ uri: selectedImage.url }}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.downloadBtn]}
                  onPress={onSaveToGallery}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionText}>Save to Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.shareBtn]}
                  onPress={onShare}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.white,
  },
  image: {
    width: '100%',
    height: SCREEN_WIDTH,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.large,
  },
  shareBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
