import { useState, useCallback } from 'react';
import { generateHairstyle } from '../services/hairstyleApi';

export function useHairstyleGeneration() {
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (imageUri, hairstyleId) => {
    setIsGenerating(true);
    setResult({ status: 'loading', hairstyleId });

    try {
      const data = await generateHairstyle(imageUri, hairstyleId);
      const entry = {
        status: 'success',
        hairstyleId,
        imageUrl: data.imageUrl,
      };
      setResult(entry);
      return entry;
    } catch (err) {
      const entry = {
        status: 'error',
        hairstyleId,
        error: err.message,
      };
      setResult(entry);
      return entry;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const retry = useCallback(
    (imageUri, hairstyleId) => generate(imageUri, hairstyleId),
    [generate]
  );

  const clear = useCallback(() => {
    setResult(null);
    setIsGenerating(false);
  }, []);

  return { result, isGenerating, generate, retry, clear };
}
