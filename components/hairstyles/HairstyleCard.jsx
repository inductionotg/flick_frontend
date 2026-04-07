import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function HairstyleCard({ item, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[s.card, isSelected && s.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={s.emoji}>{item.emoji}</Text>
      <Text style={[s.name, isSelected && s.nameSelected]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 80,
  },
  cardSelected: {
    borderColor: COLORS.teal,
    backgroundColor: 'rgba(0, 206, 201, 0.08)',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  name: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: COLORS.teal,
  },
});
