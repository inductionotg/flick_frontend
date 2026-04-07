const API_BASE_URL = 'http://192.168.1.20:3000';

function guessMimeFromUri(uri) {
  const lower = String(uri).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

export async function generateClipart(imageUri, style, options = {}) {
  const promptExtra = typeof options.promptExtra === 'string' ? options.promptExtra : '';

  const mime = guessMimeFromUri(imageUri);
  const ext = mime.split('/')[1] || 'jpg';

  const formData = new FormData();
  formData.append('style', style.id);
  if (promptExtra.trim()) {
    formData.append('promptExtra', promptExtra.trim());
  }
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

export async function generateAllStyles(imageUri, styles, options = {}) {
  const promises = styles.map((style) =>
    generateClipart(imageUri, style, options)
      .then((data) => ({ styleId: style.id, imageUrl: data.imageUrl, status: 'success' }))
      .catch((err) => ({ styleId: style.id, error: err.message, status: 'error' }))
  );

  return Promise.allSettled(promises).then((results) =>
    results.map((r) => r.value || r.reason)
  );
}
