import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function GenerateButton({ selectedCount, onPress }) {
  return (
    <View
      style={s.generateBtnShell}
      {...(Platform.OS === 'android' ? { collapsable: false } : {})}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={s.generateBtn}
      >
        <Text style={s.generateBtnText}>
          {selectedCount > 0
            ? `Generate ${selectedCount} Style${selectedCount !== 1 ? 's' : ''}`
            : 'Select styles to generate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  generateBtnShell: {
    marginTop: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    zIndex: 2,
  },
  generateBtn: {
    backgroundColor: '#00CEC9',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  generateBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});
