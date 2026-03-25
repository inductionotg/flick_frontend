import { Dimensions } from 'react-native';
import { SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const CARD_GAP = SPACING.md;
export const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - CARD_GAP) / 2;
