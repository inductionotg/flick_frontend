import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { CLIPART_STYLES } from '../constants/styles';
import { generateClipart } from '../services/api';

export function useClipartGeneration({ imageUri, styleIds, promptExtra }) {
  const [results, setResults] = useState({});

  const sessionKey =
    imageUri && styleIds ? `${imageUri}|${styleIds}|${promptExtra}` : '';

  const selectedStyles = useMemo(
    () =>
      (styleIds || '')
        .split(',')
        .map((id) => CLIPART_STYLES.find((s) => s.id === id))
        .filter(Boolean),
    [styleIds]
  );

  useEffect(() => {
    if (!sessionKey || !imageUri || !styleIds) {
      setResults({});
      return;
    }

    const selected = (styleIds || '')
      .split(',')
      .map((id) => CLIPART_STYLES.find((s) => s.id === id))
      .filter(Boolean);

    if (selected.length === 0) {
      setResults({});
      return;
    }

    const run = async () => {
      try {
        const info = await FileSystem.getInfoAsync(imageUri);
        if (!info.exists) {
          Alert.alert('Error', 'Image file not found.');
          return;
        }
      } catch {
        Alert.alert('Error', 'Could not access the image.');
        return;
      }

      setResults({});
      selected.forEach((style) => {
        setResults((prev) => ({ ...prev, [style.id]: { status: 'loading' } }));

        generateClipart(imageUri, style, { promptExtra })
          .then((data) => {
            setResults((prev) => ({
              ...prev,
              [style.id]: { status: 'success', imageUrl: data.imageUrl },
            }));
          })
          .catch((err) => {
            setResults((prev) => ({
              ...prev,
              [style.id]: { status: 'error', error: err.message },
            }));
          });
      });
    };

    run();
  }, [sessionKey, imageUri, styleIds]);

  const isGenerating = useMemo(() => {
    if (!sessionKey || selectedStyles.length === 0) return false;
    return selectedStyles.some((style) => {
      const r = results[style.id];
      return !r || r.status === 'loading';
    });
  }, [sessionKey, selectedStyles, results]);

  const generationProgress = useMemo(() => {
    const total = selectedStyles.length;
    if (total === 0) return { done: 0, total: 0, fraction: 0 };
    const done = selectedStyles.filter((style) => {
      const r = results[style.id];
      return r && (r.status === 'success' || r.status === 'error');
    }).length;
    return { done, total, fraction: done / total };
  }, [selectedStyles, results]);

  async function retryGeneration(style) {
    setResults((prev) => ({ ...prev, [style.id]: { status: 'loading' } }));

    try {
      const data = await generateClipart(imageUri, style, { promptExtra });
      setResults((prev) => ({
        ...prev,
        [style.id]: { status: 'success', imageUrl: data.imageUrl },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [style.id]: { status: 'error', error: err.message },
      }));
    }
  }

  return {
    results,
    sessionKey,
    selectedStyles,
    isGenerating,
    generationProgress,
    retryGeneration,
  };
}
