export type BetType = 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple';
export type DrawPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

// Shuffled order for visual display, but maintaining number associations
export const HEART_COLORS = [
  { color: "blue", number: 2 },      // Azul
  { color: "brown", number: 8 },     // Marrom
  { color: "white", number: 0 },     // Branco
  { color: "purple", number: 6 },    // Roxo
  { color: "yellow", number: 4 },    // Amarelo
  { color: "red", number: 1 },       // Vermelho
  { color: "black", number: 3 },     // Preto
  { color: "pink", number: 7 },      // Rosa
  { color: "gray", number: 9 },      // Cinza
  { color: "green", number: 5 },     // Verde
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