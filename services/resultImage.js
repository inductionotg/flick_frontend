import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

export async function ensureLocalImageFile(imageUrl, destUri) {
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

export async function prepareImageAsPngUri(imageUrl, workDir) {
  const rawUri = `${workDir}flick_raw_${Date.now()}`;
  await ensureLocalImageFile(imageUrl, rawUri);
  const { uri: pngUri } = await manipulateAsync(rawUri, [], { format: SaveFormat.PNG });
  await FileSystem.deleteAsync(rawUri, { idempotent: true });
  return pngUri;
}
