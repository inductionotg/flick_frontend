import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { HAIRSTYLE_CATEGORIES } from '../../constants/hairstyles';

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scroll}
      style={s.container}
    >
      {HAIRSTYLE_CATEGORIES.map((cat) => {
        const active = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[s.tab, active && s.tabActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabText, active && s.tabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  scroll: {
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});
