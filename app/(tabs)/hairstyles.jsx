import { useState, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '../../constants/theme';
import { HAIRSTYLES } from '../../constants/hairstyles';
import { isValidImageType, compressImage } from '../../services/imageUtils';
import { useHairstyleGeneration } from '../../hooks/useHairstyleGeneration';
import { useResultMediaActions } from '../../hooks/useResultMediaActions';
import HairstyleHero from '../../components/hairstyles/HairstyleHero';
import PhotoUploader from '../../components/hairstyles/PhotoUploader';
import GenderFilter from '../../components/hairstyles/GenderFilter';
import CategoryTabs from '../../components/hairstyles/CategoryTabs';
import HairstyleGallery from '../../components/hairstyles/HairstyleGallery';
import GenerateSection from '../../components/hairstyles/GenerateSection';
import ResultPreview from '../../components/hairstyles/ResultPreview';
import RecentHistory from '../../components/hairstyles/RecentHistory';

export default function HairstylesScreen() {
  const scrollRef = useRef(null);

  const [image, setImage] = useState(null);
  const [compressedUri, setCompressedUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [genderFilter, setGenderFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);

  const [history, setHistory] = useState([]);

  const { result, isGenerating, generate, clear } = useHairstyleGeneration();
  const { downloadImage, shareImage, downloadingId } = useResultMediaActions();

  const filteredHairstyles = useMemo(() => {
    return HAIRSTYLES.filter((h) => {
      if (genderFilter !== 'all' && h.gender !== 'unisex' && h.gender !== genderFilter)
        return false;
      if (categoryFilter !== 'all' && h.category !== categoryFilter) return false;
      return true;
    });
  }, [genderFilter, categoryFilter]);

  const selectedStyleObj = useMemo(
    () => HAIRSTYLES.find((h) => h.id === selectedHairstyle),
    [selectedHairstyle]
  );

  async function processImage(pickerResult) {
    if (pickerResult.canceled || !pickerResult.assets?.length) return;
    const asset = pickerResult.assets[0];

    if (asset.mimeType && !isValidImageType(asset.mimeType)) {
      Alert.alert('Invalid Format', 'Please select a JPEG or PNG image.', [{ text: 'OK' }]);
      return;
    }

    setIsProcessing(true);
    setImage(asset);
    clear();

    try {
      const compressed = await compressImage(asset.uri);
      setCompressedUri(compressed.uri);
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
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    await processImage(pickerResult);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false,
    });
    await processImage(pickerResult);
  }

  function clearImage() {
    setImage(null);
    setCompressedUri(null);
    clear();
  }

  const handleGenerate = useCallback(async () => {
    if (!compressedUri || !selectedHairstyle || isGenerating) return;

    const entry = await generate(compressedUri, selectedHairstyle);
    if (entry?.status === 'success') {
      setHistory((prev) => [
        { hairstyleId: entry.hairstyleId, imageUrl: entry.imageUrl },
        ...prev.filter((h) => h.hairstyleId !== entry.hairstyleId),
      ].slice(0, 10));
    }
  }, [compressedUri, selectedHairstyle, isGenerating, generate]);

  function handleRetry() {
    if (compressedUri && selectedHairstyle) {
      generate(compressedUri, selectedHairstyle).then((entry) => {
        if (entry?.status === 'success') {
          setHistory((prev) => [
            { hairstyleId: entry.hairstyleId, imageUrl: entry.imageUrl },
            ...prev.filter((h) => h.hairstyleId !== entry.hairstyleId),
          ].slice(0, 10));
        }
      });
    }
  }

  function handleTryAnother() {
    clear();
    setSelectedHairstyle(null);
    scrollRef.current?.scrollTo?.({ y: 0, animated: true });
  }

  function handleHistorySelect(item) {
    setSelectedHairstyle(item.hairstyleId);
  }

  const canGenerate = !!compressedUri && !!selectedHairstyle && !isProcessing;
  const showResult = result && result.status !== null;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <HairstyleHero />

        <PhotoUploader
          imageUri={image?.uri}
          isProcessing={isProcessing}
          onPickGallery={pickFromGallery}
          onTakePhoto={takePhoto}
          onRemove={clearImage}
        />

        <GenderFilter selected={genderFilter} onSelect={setGenderFilter} />
        <CategoryTabs selected={categoryFilter} onSelect={setCategoryFilter} />

        <HairstyleGallery
          hairstyles={filteredHairstyles}
          selectedId={selectedHairstyle}
          onSelect={setSelectedHairstyle}
        />

        <GenerateSection
          canGenerate={canGenerate}
          isGenerating={isGenerating}
          selectedName={selectedStyleObj?.name}
          onGenerate={handleGenerate}
        />

        {showResult && (
          <ResultPreview
            result={result}
            originalUri={image?.uri}
            hairstyleName={selectedStyleObj?.name || selectedHairstyle}
            onSave={() =>
              downloadImage(result.imageUrl, selectedStyleObj?.name || 'Hairstyle')
            }
            onShare={() => shareImage(result.imageUrl)}
            onRetry={handleRetry}
            onTryAnother={handleTryAnother}
            isSaving={!!downloadingId}
          />
        )}

        <RecentHistory history={history} onSelect={handleHistorySelect} />
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
});
