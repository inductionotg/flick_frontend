import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

export default function SkeletonLoader({
  width = '100%',
  height = 100,
  borderRadius = RADIUS.md,
  style,
}) {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerValue]);

  const backgroundColor = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.skeleton, COLORS.skeletonHighlight],
  });

  return (
    <Animated.View
      style={[
        skeletonStyles.base,
        { width, height, borderRadius, backgroundColor },
        style,
      ]}
    />
  );
}

const skeletonStyles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
