import { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '../../constants/theme';
import { isValidImageType, compressImage, getFileSize } from '../../services/imageUtils';
import { validatePromptExtraForUi, MAX_PROMPT_EXTRA_LENGTH } from '../../services/promptExtra';
import HeroSection from '../../components/home/HeroSection';
import ImageUploader from '../../components/home/ImageUploader';
import ImagePreview from '../../components/home/ImagePreview';
import StylePicker from '../../components/home/StylePicker';
import PromptCard from '../../components/home/PromptCard';
import GenerateButton from '../../components/home/GenerateButton';

export default function HomeScreen() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [promptExtra, setPromptExtra] = useState('');

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
      if (prev.includes(styleId)) return prev.filter((id) => id !== styleId);
      return [...prev, styleId];
    });
  }

  function appendPromptSpark(suffix) {
    setPromptExtra((prev) => {
      const base = prev.trim();
      const addition = base ? `${base}, ${suffix}` : suffix;
      if (addition.length <= MAX_PROMPT_EXTRA_LENGTH) return addition;
      return addition.slice(0, MAX_PROMPT_EXTRA_LENGTH);
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
    const promptCheck = validatePromptExtraForUi(promptExtra);
    if (!promptCheck.ok) {
      Alert.alert('Prompt', promptCheck.error);
      return;
    }
    const params = {
      imageUri: compressedImage.uri,
      styles: selectedStyles.join(','),
    };
    if (promptCheck.value) {
      params.promptExtra = encodeURIComponent(promptCheck.value);
    }
    router.push({ pathname: '/(tabs)/result', params });
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <HeroSection />

        {!image ? (
          <ImageUploader onPickGallery={pickFromGallery} onTakePhoto={takePhoto} />
        ) : (
          <ImagePreview
            imageUri={image.uri}
            compressedUri={compressedImage?.uri}
            originalSize={originalSize}
            compressedSize={compressedSize}
            isProcessing={isProcessing}
            onRemove={clearImage}
          />
        )}

        <StylePicker selectedStyles={selectedStyles} onToggleStyle={toggleStyle} />

        <PromptCard
          promptExtra={promptExtra}
          onChangePrompt={setPromptExtra}
          onAppendSpark={appendPromptSpark}
          disabled={isProcessing}
        />

        <GenerateButton selectedCount={selectedStyles.length} onPress={goGenerate} />
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
