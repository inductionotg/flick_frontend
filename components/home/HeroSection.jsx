import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function HeroSection() {
  return (
    <>
      <Text style={s.brand}>Clip Art</Text>
      <View style={s.heroSection}>
        <Text style={s.heroText}>
          Turn your{'\n'}world into <Text style={s.heroAccent}>art.</Text>
        </Text>
        <Text style={s.heroSub}>
          Upload a photo and let our clipart transform it into a unique, high-fidelity clipart sticker in seconds.
        </Text>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  brand: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginTop: SPACING.md,
    letterSpacing: 1,
  },
  heroSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  heroText: {
    fontSize: FONT_SIZE.hero,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 44,
  },
  heroAccent: {
    color: COLORS.primaryLight,
    fontStyle: 'italic',
  },
  heroSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 20,
  },
});
