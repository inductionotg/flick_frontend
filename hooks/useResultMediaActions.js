import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { prepareImageAsPngUri } from '../services/resultImage';

export function useResultMediaActions() {
  const [downloadingId, setDownloadingId] = useState(null);

  async function downloadImage(imageUrl, styleName) {
    try {
      setDownloadingId(styleName);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to save images.');
        return;
      }

      const pngUri = await prepareImageAsPngUri(imageUrl, FileSystem.cacheDirectory);
      await MediaLibrary.saveToLibraryAsync(pngUri);
      await FileSystem.deleteAsync(pngUri, { idempotent: true });
      Alert.alert('Saved!', `${styleName} clipart saved to your gallery.`);
    } catch {
      Alert.alert('Error', 'Failed to save the image.');
    } finally {
      setDownloadingId(null);
    }
  }

  async function shareImage(imageUrl) {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Unavailable', 'Sharing is not available on this device.');
        return;
      }

      const pngUri = await prepareImageAsPngUri(imageUrl, FileSystem.cacheDirectory);
      await Sharing.shareAsync(pngUri, { mimeType: 'image/png' });
      await FileSystem.deleteAsync(pngUri, { idempotent: true });
    } catch {
      Alert.alert('Error', 'Failed to share the image.');
    }
  }

  return { downloadImage, shareImage, downloadingId };
}
