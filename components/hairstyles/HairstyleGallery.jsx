import { View, FlatList, StyleSheet } from 'react-native';
import { SPACING } from '../../constants/theme';
import HairstyleCard from './HairstyleCard';

export default function HairstyleGallery({ hairstyles, selectedId, onSelect }) {
  return (
    <FlatList
      data={hairstyles}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={s.grid}
      columnWrapperStyle={s.row}
      renderItem={({ item }) => (
        <HairstyleCard
          item={item}
          isSelected={selectedId === item.id}
          onPress={() => onSelect(item.id)}
        />
      )}
      ListFooterComponent={<View style={{ height: SPACING.sm }} />}
    />
  );
}

const s = StyleSheet.create({
  grid: {
    paddingBottom: SPACING.xs,
  },
  row: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
});
