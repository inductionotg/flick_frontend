import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

export default function GenerateSection({ canGenerate, isGenerating, selectedName, onGenerate }) {
  const label = isGenerating
    ? 'Generating...'
    : selectedName
      ? `Generate ${selectedName}`
      : 'Select a hairstyle';

  return (
    <View style={s.container}>
      <TouchableOpacity
        style={[s.btn, (!canGenerate || isGenerating) && s.btnDisabled]}
        onPress={onGenerate}
        activeOpacity={0.88}
        disabled={!canGenerate || isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color={COLORS.white} size="small" style={{ marginRight: 8 }} />
        ) : (
          <Ionicons name="sparkles" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
        )}
        <Text style={s.btnText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: COLORS.teal,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});
