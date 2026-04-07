import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { GENDER_FILTERS } from '../../constants/hairstyles';

export default function GenderFilter({ selected, onSelect }) {
  return (
    <View style={s.container}>
      {GENDER_FILTERS.map((g) => {
        const active = selected === g.id;
        return (
          <TouchableOpacity
            key={g.id}
            style={[s.chip, active && s.chipActive]}
            onPress={() => onSelect(g.id)}
            activeOpacity={0.8}
          >
            <Text style={[s.chipText, active && s.chipTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  chipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.white,
  },
});
