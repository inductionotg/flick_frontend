import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { COLORS, SPACING, RADIUS, FONT_SIZE, SHADOWS } from '../../constants/theme';
import { CLIPART_STYLES } from '../../constants/styles';
import SkeletonLoader from '../../components/SkeletonLoader';
import { generateClipart } from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = SPACING.md;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - CARD_GAP) / 2;

const JOKE_ROTATE_MS = 4000;

const AI_WAIT_JOKES = [
  'The AI is drawing… fingers crossed it’s not stick figures.',
  'Teaching pixels to behave. Please hold.',
  'Your GPU is basically doing cardio right now.',
  'The model asked for coffee. We said “after the batch.”',
  'Still faster than explaining “the cloud” to your uncle.',
  'Neurons are politely arguing about which blue is the bluest.',
  'Transforming reality into clipart—no pixels were harmed.',
  'Almost there. The AI is choosing the perfect questionable outline.',
  'This is what “thinking in vectors” looks like. Messy but cute.',
  'Hang tight—we’re negotiating with a very picky diffusion model.',
  'Fun fact: every loading skeleton is doing emotional support work.',
  'If art is theft, this AI is the world’s politest burglar.',
  'Your photo is in a meeting with 1.5 billion parameters.',
  'Good things come to those who wait… and to those who batch requests.',
  'The neural net is vibing. Results incoming.',
];

function styleEmoji(style) {
  return style.icon ?? '🎨';
}

async function ensureLocalImageFile(imageUrl, destUri) {
  if (imageUrl.startsWith('data:')) {
    const comma = imageUrl.indexOf(',');
    const base64 = comma >= 0 ? imageUrl.slice(comma + 1) : imageUrl;
    await FileSystem.writeAsStringAsync(destUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return destUri;
  }
  const download = await FileSystem.downloadAsync(imageUrl, destUri);
  return download.uri;
}

export default function ResultTabScreen() {
  const router = useRouter();
  const { imageUri, styles: styleIds } = useLocalSearchParams();
  const [results, setResults] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [jokeIndex, setJokeIndex] = useState(0);

  const sessionKey = imageUri && styleIds ? `${imageUri}|${styleIds}` : '';

  const selectedStyles = useMemo(
    () =>
      (styleIds || '')
        .split(',')
        .map((id) => CLIPART_STYLES.find((s) => s.id === id))
        .filter(Boolean),
    [styleIds]
  );

  useEffect(() => {
    if (!sessionKey || !imageUri || !styleIds) {
      setResults({});
      return;
    }

    const selected = (styleIds || '')
      .split(',')
      .map((id) => CLIPART_STYLES.find((s) => s.id === id))
      .filter(Boolean);

    if (selected.length === 0) {
      setResults({});
      return;
    }

    const run = async () => {

      try {
        const info = await FileSystem.getInfoAsync(imageUri);
        if (!info.exists) {
          Alert.alert('Error', 'Image file not found.');
          return;
        }
      } catch (e) {
        Alert.alert('Error', 'Could not access the image.');
        return;
      }

      setResults({});
      selected.forEach((style) => {
        setResults((prev) => ({ ...prev, [style.id]: { status: 'loading' } }));

        generateClipart(imageUri, style)
          .then((data) => {
            setResults((prev) => ({
              ...prev,
              [style.id]: { status: 'success', imageUrl: data.imageUrl },
            }));
          })
          .catch((err) => {
            setResults((prev) => ({
              ...prev,
              [style.id]: { status: 'error', error: err.message },
            }));
          });
      });
    };

    run();
  }, [sessionKey, imageUri, styleIds]);

  const isGenerating = useMemo(() => {
    if (!sessionKey || selectedStyles.length === 0) return false;
    return selectedStyles.some((style) => {
      const r = results[style.id];
      return !r || r.status === 'loading';
    });
  }, [sessionKey, selectedStyles, results]);

  useEffect(() => {
    if (!isGenerating) return undefined;

    setJokeIndex(0);

    const id = setInterval(() => {
      setJokeIndex((i) => (i + 1) % AI_WAIT_JOKES.length);
    }, JOKE_ROTATE_MS);

    return () => clearInterval(id);
  }, [isGenerating]);

  async function retryGeneration(style) {
    setResults((prev) => ({ ...prev, [style.id]: { status: 'loading' } }));

    try {
      const data = await generateClipart(imageUri, style);
      setResults((prev) => ({
        ...prev,
        [style.id]: { status: 'success', imageUrl: data.imageUrl },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [style.id]: { status: 'error', error: err.message },
      }));
    }
  }

  async function downloadImage(imageUrl, styleName) {
    try {
      setDownloadingId(styleName);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to save images.');
        return;
      }

      const filename = `flick_${styleName}_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      await ensureLocalImageFile(imageUrl, fileUri);

      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert('Saved!', `${styleName} clipart saved to your gallery.`);
    } catch {
      Alert.alert('Error', 'Failed to save the image.');
    } finally {
      setDownloadingId(null);
    }
  }

  async function shareImage(imageUrl, styleName) {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Unavailable', 'Sharing is not available on this device.');
        return;
      }

      const filename = `flick_${styleName}_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await ensureLocalImageFile(imageUrl, fileUri);
      await Sharing.shareAsync(fileUri, { mimeType: 'image/jpeg' });
    } catch {
      Alert.alert('Error', 'Failed to share the image.');
    }
  }

  function goHome() {
    router.push('/(tabs)/');
  }

  function renderCard({ item: style }) {
    const result = results[style.id];

    return (
      <View style={cardStyles.card}>
        <View style={cardStyles.cardHeader}>
          <Text style={cardStyles.icon}>{styleEmoji(style)}</Text>
          <Text style={cardStyles.styleName}>{style.name}</Text>
        </View>

        <View style={cardStyles.imageContainer}>
          {!result || result.status === 'loading' ? (
            <SkeletonLoader width={CARD_WIDTH - 2} height={CARD_WIDTH - 2} borderRadius={0} />
          ) : result.status === 'error' ? (
            <View style={cardStyles.errorContainer}>
              <Text style={cardStyles.errorIcon}>⚠️</Text>
              <Text style={cardStyles.errorText}>Failed</Text>
              <TouchableOpacity
                style={cardStyles.retryButton}
                onPress={() => retryGeneration(style)}
                activeOpacity={0.7}
              >
                <Text style={cardStyles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                setSelectedImage({ url: result.imageUrl, style })
              }
            >
              <Image
                source={{ uri: result.imageUrl }}
                style={cardStyles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        </View>

        {result?.status === 'success' && (
          <View style={cardStyles.actions}>
            <TouchableOpacity
              style={cardStyles.actionBtn}
              onPress={() => downloadImage(result.imageUrl, style.name)}
              activeOpacity={0.7}
              disabled={downloadingId === style.name}
            >
              {downloadingId === style.name ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={cardStyles.actionText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={cardStyles.actionBtn}
              onPress={() => shareImage(result.imageUrl, style.name)}
              activeOpacity={0.7}
            >
              <Text style={cardStyles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  const hasSession = sessionKey && selectedStyles.length > 0;

  return (
    <SafeAreaView style={screenStyles.container}>
      <View style={screenStyles.header}>
        <TouchableOpacity onPress={goHome} style={screenStyles.backButton}>
          <Text style={screenStyles.backText}>← Home</Text>
        </TouchableOpacity>
        <Text style={screenStyles.title}>Results</Text>
        <Text style={screenStyles.subtitle}>
          {hasSession
            ? `${selectedStyles.length} style${selectedStyles.length !== 1 ? 's' : ''}`
            : 'Your generated clipart appears here'}
        </Text>
      </View>

      {hasSession && isGenerating ? (
        <View style={screenStyles.jokeBanner}>
          <Text style={screenStyles.jokeLabel}>While you wait</Text>
          <Text style={screenStyles.jokeText}>{AI_WAIT_JOKES[jokeIndex]}</Text>
        </View>
      ) : null}

      {!hasSession ? (
        <View style={screenStyles.empty}>
          <Text style={screenStyles.emptyIcon}>✨</Text>
          <Text style={screenStyles.emptyTitle}>No results yet</Text>
          <Text style={screenStyles.emptyText}>
            On the Home tab, upload a photo, choose styles, then tap Generate. Your clipart will
            show up on this tab.
          </Text>
          <TouchableOpacity style={screenStyles.emptyCta} onPress={goHome} activeOpacity={0.85}>
            <Text style={screenStyles.emptyCtaText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={selectedStyles}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={screenStyles.grid}
          columnWrapperStyle={screenStyles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      {hasSession ? (
        <View style={screenStyles.bottomBar}>
          <TouchableOpacity
            style={screenStyles.newButton}
            onPress={() => router.replace('/(tabs)/')}
            activeOpacity={0.8}
          >
            <Text style={screenStyles.newButtonText}>New Image</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <SafeAreaView style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>
                {selectedImage ? `${styleEmoji(selectedImage.style)} ${selectedImage.style.name}` : ''}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={modalStyles.closeButton}
              >
                <Text style={modalStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.url }}
                  style={modalStyles.image}
                  resizeMode="contain"
                />
                <View style={modalStyles.actions}>
                  <TouchableOpacity
                    style={[modalStyles.actionBtn, modalStyles.downloadBtn]}
                    onPress={() =>
                      downloadImage(selectedImage.url, selectedImage.style.name)
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={modalStyles.actionText}>Save to Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[modalStyles.actionBtn, modalStyles.shareBtn]}
                    onPress={() =>
                      shareImage(selectedImage.url, selectedImage.style.name)
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={modalStyles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backButton: {
    marginBottom: SPACING.sm,
  },
  backText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
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
  jokeLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
  },
  jokeText: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    color: COLORS.text,
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  emptyCta: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
  },
  emptyCtaText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  grid: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
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
  newButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
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
  icon: {
    fontSize: 16,
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
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontWeight: '600',
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

const modalStyles = StyleSheet.create({
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
