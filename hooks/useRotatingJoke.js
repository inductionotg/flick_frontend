import { useState, useEffect } from 'react';
import { AI_WAIT_JOKES, JOKE_ROTATE_MS } from '../constants/resultLoading';

export function useRotatingJoke(isGenerating) {
  const [jokeIndex, setJokeIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return undefined;

    setJokeIndex(0);

    const id = setInterval(() => {
      setJokeIndex((i) => (i + 1) % AI_WAIT_JOKES.length);
    }, JOKE_ROTATE_MS);

    return () => clearInterval(id);
  }, [isGenerating]);

  return AI_WAIT_JOKES[jokeIndex];
}
