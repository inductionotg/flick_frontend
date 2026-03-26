import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { MAX_PROMPT_EXTRA_LENGTH } from '../../services/promptExtra';

const PROMPT_SPARKS = [
  { id: 'sparkles', label: 'More sparkles', suffix: 'more sparkles and glitter' },
  { id: 'lighting', label: 'Dramatic lighting', suffix: 'dramatic lighting' },
  { id: '8bit', label: '8-bit style', suffix: 'strong 8-bit pixel aesthetic' },
];

const SPARK_ICONS = { sparkles: '✦', lighting: '◐', '8bit': '▦' };

export default function PromptCard({ promptExtra, onChangePrompt, onAppendSpark, disabled }) {
  return (
    <View style={s.promptCard}>
      <View style={s.promptCardHeader}>
        <Text style={s.promptCardIcon} accessibilityLabel="Prompt">
          ✎
        </Text>
        <View style={s.promptCardTitles}>
          <Text style={s.promptCardTitle}>
            Add your magic touch{' '}
            <Text style={s.promptCardOptional}>(optional)</Text>
          </Text>
        </View>
      </View>
      <TextInput
        style={s.promptInput}
        placeholder="A cyberpunk cat with neon glasses..."
        placeholderTextColor={COLORS.textMuted}
        value={promptExtra}
        onChangeText={(t) => {
          if (t.length <= MAX_PROMPT_EXTRA_LENGTH) onChangePrompt(t);
        }}
        multiline
        textAlignVertical="top"
        maxLength={MAX_PROMPT_EXTRA_LENGTH}
        editable={!disabled}
        accessibilityLabel="Optional extra prompt details"
      />
      <Text style={s.promptCounter}>
        {promptExtra.length}/{MAX_PROMPT_EXTRA_LENGTH}
      </Text>
      <Text style={s.promptSparksLabel}>PROMPT SPARKS</Text>
      <View style={s.promptSparksRow}>
        {PROMPT_SPARKS.map((spark) => (
          <TouchableOpacity
            key={spark.id}
            style={s.promptSparkChip}
            onPress={() => onAppendSpark(spark.suffix)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Add ${spark.label}`}
          >
            <Text style={s.promptSparkIcon}>{SPARK_ICONS[spark.id]}</Text>
            <Text style={s.promptSparkText} numberOfLines={1}>
              {spark.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  promptCard: {
    backgroundColor: 'rgba(108, 92, 231, 0.12)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(162, 155, 254, 0.35)',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  promptCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  promptCardIcon: {
    fontSize: 22,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  promptCardTitles: {
    flex: 1,
  },
  promptCardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: '#E8E4FF',
  },
  promptCardOptional: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  promptInput: {
    minHeight: 100,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: '#1A1A2E',
    marginBottom: SPACING.xs,
  },
  promptCounter: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginBottom: SPACING.md,
  },
  promptSparksLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: 'rgba(162, 155, 254, 0.85)',
    marginBottom: SPACING.sm,
  },
  promptSparksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  promptSparkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(162, 155, 254, 0.25)',
    maxWidth: '100%',
  },
  promptSparkIcon: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  promptSparkText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text,
    flexShrink: 1,
  },
});
