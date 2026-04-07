import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { HAIRSTYLES } from '../../constants/hairstyles';

export default function RecentHistory({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  function renderItem({ item }) {
    const style = HAIRSTYLES.find((h) => h.id === item.hairstyleId);
    return (
      <TouchableOpacity
        style={s.card}
        onPress={() => onSelect(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imageUrl }} style={s.thumb} resizeMode="cover" />
        <Text style={s.label} numberOfLines={1}>
          {style?.name || item.hairstyleId}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Recent Hairstyles</Text>
      <FlatList
        data={history}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.list}
        renderItem={renderItem}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  list: {
    gap: SPACING.sm,
  },
  card: {
    width: 100,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  thumb: {
    width: 100,
    height: 100,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});
