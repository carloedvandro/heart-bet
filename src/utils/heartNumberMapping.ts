import { HEART_COLORS } from "@/types/betting";

// Fixed mapping between heart colors and numbers
const heartNumberMapping: { [key: string]: number } = {
  white: 0,
  red: 1,
  blue: 2,
  black: 3,
  yellow: 4,
  green: 5,
  purple: 6,
  pink: 7,
  brown: 8,
  gray: 9
};

export const getNumberForHeart = (color: string): number => {
  return heartNumberMapping[color] ?? 0;
};