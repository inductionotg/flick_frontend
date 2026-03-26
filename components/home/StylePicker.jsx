import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { CLIPART_STYLES } from '../../constants/styles';

const STYLE_CARD_WIDTH = 176;
const STYLE_CARD_HEIGHT = Math.round((STYLE_CARD_WIDTH * 4) / 3);

export default function StylePicker({ selectedStyles, onToggleStyle }) {
  return (
    <View style={s.styleSection}>
      <Text style={s.styleTitle}>Choose Magic Style</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        fadingEdgeLength={0}
        overScrollMode="never"
        style={s.styleScroll}
        contentContainerStyle={s.styleRow}
      >
        {CLIPART_STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.id);
          return (
            <View
              key={style.id}
              style={[
                s.styleBoxOuter,
                { borderColor: isSelected ? style.color : COLORS.border },
                isSelected && { borderWidth: 3 },
              ]}
            >
              <TouchableOpacity
                style={s.styleBoxTouchable}
                onPress={() => onToggleStyle(style.id)}
                activeOpacity={0.88}
                accessibilityLabel={`${style.name} style`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={s.styleBoxInner}>
                  <Image
                    source={style.preview}
                    style={s.styleBoxImage}
                    resizeMode="cover"
                    {...(Platform.OS === 'android' ? { resizeMethod: 'scale' } : {})}
                  />
                  <View style={s.styleBoxLabelBar} pointerEvents="none">
                    <Text
                      style={s.styleBoxLabel}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {style.name}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={[s.styleBoxCheckBadge, { borderColor: style.color }]}>
                      <Text style={s.styleBoxCheck}>✓</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  styleSection: {
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  styleScroll: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  styleTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  styleRow: {
    gap: SPACING.md,
    paddingRight: SPACING.sm,
    alignItems: 'flex-start',
  },
  styleBoxOuter: {
    width: STYLE_CARD_WIDTH,
    height: STYLE_CARD_HEIGHT,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  styleBoxTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  styleBoxInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  styleBoxImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  styleBoxLabelBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 11,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.88)',
    minHeight: 48,
    justifyContent: 'flex-end',
  },
  styleBoxLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  styleBoxCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleBoxCheck: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.background,
  },
});
