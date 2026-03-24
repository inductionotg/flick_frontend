import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.7;
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export function isValidImageType(mimeType) {
  if (!mimeType) return false;
  return VALID_TYPES.includes(mimeType.toLowerCase());
}

export function getFileSizeLabel(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export async function getFileSize(uri) {
  try {
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    return info.size || 0;
  } catch {
    return 0;
  }
}

export async function compressImage(uri) {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION } }],
    { compress: JPEG_QUALITY, format: SaveFormat.JPEG }
  );

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

export async function imageToBase64(uri) {
  console.log('[imageToBase64] input uri:', uri);
  try {
    const info = await FileSystem.getInfoAsync(uri);
    console.log('[imageToBase64] file exists:', info.exists, 'size:', info.size);
    if (!info.exists) {
      console.error('[imageToBase64] file does not exist at uri:', uri);
      return null;
    }
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('[imageToBase64] success, base64 length:', base64?.length);
    return base64;
  } catch (err) {
    console.error('[imageToBase64] error:', err.message, 'uri:', uri);
    return null;
  }
}
