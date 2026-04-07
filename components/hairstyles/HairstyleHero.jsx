import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function HairstyleHero() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Hairstyles</Text>
      <Text style={s.subtitle}>
        Try different hairstyles on your photo — your face stays exactly the same
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.hero,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
});
