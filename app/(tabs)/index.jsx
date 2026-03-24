import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, FONT_SIZE, SHADOWS } from '../../constants/theme';
import { CLIPART_STYLES } from '../../constants/styles';
import {
  isValidImageType,
  compressImage,
  getFileSize,
  getFileSizeLabel,
} from '../../services/imageUtils';

const STYLE_CARD_WIDTH = 176;
const STYLE_CARD_HEIGHT = Math.round((STYLE_CARD_WIDTH * 4) / 3);

export default function HomeScreen() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);

  async function processImage(result) {
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];

    if (asset.mimeType && !isValidImageType(asset.mimeType)) {
      Alert.alert('Invalid Format', 'Please select a JPEG or PNG image.', [{ text: 'OK' }]);
      return;
    }

    setIsProcessing(true);
    setImage(asset);

    try {
      const origSize = await getFileSize(asset.uri);
      setOriginalSize(origSize);

      const compressed = await compressImage(asset.uri);
      const compSize = await getFileSize(compressed.uri);

      setCompressedImage(compressed);
      setCompressedSize(compSize);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to process the image.');
      setImage(null);
    } finally {
      setIsProcessing(false);
    }
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    await processImage(result);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false,
    });
    await processImage(result);
  }

  function clearImage() {
    setImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
  }

  function toggleStyle(styleId) {
    setSelectedStyles((prev) => {
      if (prev.includes(styleId)) {
        return prev.filter((id) => id !== styleId);
      }
      return [...prev, styleId];
    });
  }

  function goGenerate() {
    if (isProcessing) return;
    if (!compressedImage) {
      Alert.alert('No Image', 'Please upload an image first.');
      return;
    }
    if (selectedStyles.length === 0) {
      Alert.alert('No Style', 'Please select at least one style.');
      return;
    }
    router.push({
      pathname: '/(tabs)/result',
      params: {
        imageUri: compressedImage.uri,
        styles: selectedStyles.join(','),
      },
    });
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <Text style={s.brand}>Sticker Spark</Text>

        <View style={s.heroSection}>
          <Text style={s.heroText}>
            Turn your{'\n'}world into <Text style={s.heroAccent}>art.</Text>
          </Text>
          <Text style={s.heroSub}>
            Upload a photo and let our Ethereal Studio transform it into a unique, high-fidelity clipart sticker in seconds.
          </Text>
        </View>

        {!image ? (
          <View style={s.uploadBox}>
            <View style={s.uploadIconWrap}>
              <Text style={s.uploadIconText}>☁️</Text>
            </View>
            <Text style={s.uploadTitle}>Drop your image here</Text>
            <Text style={s.uploadHint}>
              Supports PNG, JPG and HEIC up to 15MB.{'\n'}Best results with clear subjects.
            </Text>

            <TouchableOpacity style={s.galleryBtn} onPress={pickFromGallery} activeOpacity={0.8}>
              <Text style={s.galleryBtnText}>Choose Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.cameraBtn} onPress={takePhoto} activeOpacity={0.8}>
              <Text style={s.cameraBtnText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.previewSection}>
            <View style={s.previewHeader}>
              <Text style={s.previewLabel}>Preview</Text>
              <View style={s.previewMeta}>
                <Text style={s.sizeText}>
                  {getFileSizeLabel(originalSize)} → {getFileSizeLabel(compressedSize)}
                </Text>
                <TouchableOpacity onPress={clearImage}>
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
                  source={{ uri: compressedImage?.uri || image.uri }}
                  style={s.previewImage}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>
        )}

        <View style={s.styleSection}>
          <Text style={s.styleTitle}>Choose Magic Style</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            fadingEdgeLength={0}
            overScrollMode="never"
            style={s.styleScroll}
            contentContainerStyle={s.styleRow}
          >
            {CLIPART_STYLES.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <View
                  key={style.id}
                  style={[
                    s.styleBoxOuter,
                    { borderColor: isSelected ? style.color : COLORS.border },
                    isSelected && { borderWidth: 3 },
                  ]}
                >
                  <TouchableOpacity
                    style={s.styleBoxTouchable}
                    onPress={() => toggleStyle(style.id)}
                    activeOpacity={0.88}
                    accessibilityLabel={`${style.name} style`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={s.styleBoxInner}>
                      <Image
                        source={style.preview}
                        style={s.styleBoxImage}
                        resizeMode="cover"
                        {...(Platform.OS === 'android' ? { resizeMethod: 'scale' } : {})}
                      />
                      <View style={s.styleBoxLabelBar} pointerEvents="none">
                        <Text
                          style={s.styleBoxLabel}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {style.name}
                        </Text>
                      </View>
                      {isSelected ? (
                        <View style={[s.styleBoxCheckBadge, { borderColor: style.color }]}>
                          <Text style={s.styleBoxCheck}>✓</Text>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={s.generateBtnShell}
          {...(Platform.OS === 'android' ? { collapsable: false } : {})}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={goGenerate}
            style={s.generateBtn}
          >
            <Text style={s.generateBtnText}>
              {selectedStyles.length > 0
                ? `Generate ${selectedStyles.length} Style${selectedStyles.length !== 1 ? 's' : ''}`
                : 'Select styles to generate'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },

  brand: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginTop: SPACING.md,
    letterSpacing: 1,
  },

  heroSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  heroText: {
    fontSize: FONT_SIZE.hero,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 44,
  },
  heroAccent: {
    color: COLORS.primaryLight,
    fontStyle: 'italic',
  },
  heroSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 20,
  },

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

  styleSection: {
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  styleScroll: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  styleTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  styleRow: {
    gap: SPACING.md,
    paddingRight: SPACING.sm,
    alignItems: 'flex-start',
  },
  styleBoxOuter: {
    width: STYLE_CARD_WIDTH,
    height: STYLE_CARD_HEIGHT,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  styleBoxTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  styleBoxInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  styleBoxImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  styleBoxLabelBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 11,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.88)',
    minHeight: 48,
    justifyContent: 'flex-end',
  },
  styleBoxLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  styleBoxCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleBoxCheck: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.background,
  },

  generateBtnShell: {
    marginTop: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    zIndex: 2,
  },
  generateBtn: {
    backgroundColor: '#00CEC9',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  generateBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});
