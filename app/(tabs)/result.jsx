import { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { decodePromptExtraFromRoute } from '../../services/promptExtra';
import { useClipartGeneration } from '../../hooks/useClipartGeneration';
import { useRotatingJoke } from '../../hooks/useRotatingJoke';
import { useResultMediaActions } from '../../hooks/useResultMediaActions';
import ResultHeader from '../../components/result/ResultHeader';
import GenerationProgressBanner from '../../components/result/GenerationProgressBanner';
import ResultEmptyState from '../../components/result/ResultEmptyState';
import ResultCard from '../../components/result/ResultCard';
import ResultBottomBar from '../../components/result/ResultBottomBar';
import ImagePreviewModal from '../../components/result/ImagePreviewModal';
import { CARD_WIDTH, CARD_GAP } from '../../components/result/layout';

export default function ResultTabScreen() {
  const router = useRouter();
  const { imageUri, styles: styleIds, promptExtra: promptExtraEncoded } = useLocalSearchParams();
  const promptExtra = decodePromptExtraFromRoute(promptExtraEncoded);

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    results,
    sessionKey,
    selectedStyles,
    isGenerating,
    generationProgress,
    retryGeneration,
  } = useClipartGeneration({ imageUri, styleIds, promptExtra });

  const jokeText = useRotatingJoke(isGenerating);
  const { downloadImage, shareImage, downloadingId } = useResultMediaActions();

  const hasSession = sessionKey && selectedStyles.length > 0;

  function goHome() {
    router.push('/(tabs)/');
  }

  function renderCard({ item: style }) {
    const result = results[style.id];
    return (
      <ResultCard
        style={style}
        result={result}
        cardWidth={CARD_WIDTH}
        onImagePress={() => setSelectedImage({ url: result.imageUrl, style })}
        onRetry={() => retryGeneration(style)}
        onDownload={() => downloadImage(result.imageUrl, style.name)}
        onShare={() => shareImage(result.imageUrl)}
        downloadingId={downloadingId}
      />
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <ResultHeader
        hasSession={hasSession}
        styleCount={selectedStyles.length}
        onBack={goHome}
      />

      {hasSession && isGenerating ? (
        <GenerationProgressBanner generationProgress={generationProgress} jokeText={jokeText} />
      ) : null}

      {!hasSession ? (
        <ResultEmptyState onGoHome={goHome} />
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
        <ResultBottomBar
          isGenerating={isGenerating}
          onNewImage={() => router.replace('/(tabs)/')}
        />
      ) : null}

      <ImagePreviewModal
        visible={!!selectedImage}
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onSaveToGallery={() =>
          selectedImage && downloadImage(selectedImage.url, selectedImage.style.name)
        }
        onShare={() => selectedImage && shareImage(selectedImage.url)}
      />
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  grid: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
});
