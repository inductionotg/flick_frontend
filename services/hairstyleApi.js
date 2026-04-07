const API_BASE_URL = 'http://192.168.1.20:3000';

function guessMimeFromUri(uri) {
  const lower = String(uri).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

export async function generateHairstyle(imageUri, hairstyleId) {
  const mime = guessMimeFromUri(imageUri);
  const ext = mime.split('/')[1] || 'jpg';

  const formData = new FormData();
  formData.append('hairstyle', hairstyleId);
  formData.append('image', {
    uri: imageUri,
    name: `upload.${ext}`,
    type: mime,
  });

  const response = await fetch(`${API_BASE_URL}/api/hairstyle`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg;
    try {
      errorMsg = JSON.parse(errorText).error;
    } catch {
      errorMsg = errorText;
    }
    throw new Error(errorMsg || `Hairstyle generation failed (${response.status})`);
  }

  return response.json();
}
