import { useState, useRef } from 'react';
import { View, Image, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = 340;

export default function ComparisonSlider({ originalUri, generatedUri, width }) {
  const containerWidth = width || SCREEN_WIDTH - 48;
  const [sliderX, setSliderX] = useState(containerWidth / 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(0, Math.min(containerWidth, sliderX + gesture.dx));
        setSliderX(newX);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View style={[s.container, { width: containerWidth, height: SLIDER_HEIGHT }]}>
      <Image
        source={{ uri: generatedUri }}
        style={[s.image, { width: containerWidth, height: SLIDER_HEIGHT }]}
        resizeMode="cover"
      />

      <View style={[s.clipWrapper, { width: sliderX, height: SLIDER_HEIGHT }]}>
        <Image
          source={{ uri: originalUri }}
          style={[s.image, { width: containerWidth, height: SLIDER_HEIGHT }]}
          resizeMode="cover"
        />
      </View>

      <View style={[s.sliderLine, { left: sliderX - 1 }]} {...panResponder.panHandlers}>
        <View style={s.handle} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  clipWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  sliderLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 24,
    marginLeft: -12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  handle: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
