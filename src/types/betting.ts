export type BetType = 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple';
export type DrawPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export const HEART_COLORS = [
  { color: "pink", number: 0 },
  { color: "red", number: 1 },
  { color: "orange", number: 2 },
  { color: "yellow", number: 3 },
  { color: "green", number: 4 },
  { color: "blue", number: 5 },
  { color: "purple", number: 6 },
  { color: "coral", number: 7 },
  { color: "indigo", number: 8 },
  { color: "crimson", number: 9 },
] as const;

export const MAX_SELECTIONS: Record<BetType, number> = {
  simple_group: 1,
  dozen: 2,
  hundred: 3,
  thousand: 4,
  group_double: 2,
  group_triple: 3,
};

export const PERIOD_LIMITS: Record<DrawPeriod, string> = {
  morning: "11:00",
  afternoon: "15:00",
  evening: "19:00",
  night: "22:00",
};

export const BET_MULTIPLIERS: Record<BetType, number> = {
  simple_group: 9,
  dozen: 30,
  hundred: 300,
  thousand: 2000,
  group_double: 150,
  group_triple: 250,
};