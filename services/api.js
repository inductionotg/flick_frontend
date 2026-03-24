const API_BASE_URL = 'https://flick-backend-eqs8.onrender.com';

function guessMimeFromUri(uri) {
  const lower = String(uri).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

export async function generateClipart(imageUri, style) {

  const mime = guessMimeFromUri(imageUri);
  const ext = mime.split('/')[1] || 'jpg';

  const formData = new FormData();
  formData.append('style', style.id);
  formData.append('image', {
    uri: imageUri,
    name: `upload.${ext}`,
    type: mime,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
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
      throw new Error(errorMsg || `Generation failed (${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function generateAllStyles(imageUri, styles) {
  const promises = styles.map((style) =>
    generateClipart(imageUri, style)
      .then((data) => ({ styleId: style.id, imageUrl: data.imageUrl, status: 'success' }))
      .catch((err) => ({ styleId: style.id, error: err.message, status: 'error' }))
  );

  return Promise.allSettled(promises).then((results) =>
    results.map((r) => r.value || r.reason)
  );
}
