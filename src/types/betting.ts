export type BetType = 'simple_group' | 'dozen' | 'hundred' | 'thousand' | 'group_double' | 'group_triple';
export type DrawPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

// Ordered by number for reference, but UI will display randomly
export const HEART_COLORS = [
  { color: "white", number: 0 },     // Branco
  { color: "red", number: 1 },       // Vermelho
  { color: "blue", number: 2 },      // Azul
  { color: "black", number: 3 },     // Preto
  { color: "yellow", number: 4 },    // Amarelo
  { color: "green", number: 5 },     // Verde
  { color: "purple", number: 6 },    // Roxo
  { color: "pink", number: 7 },      // Rosa
  { color: "brown", number: 8 },     // Marrom
  { color: "gray", number: 9 },      // Cinza
] as const;

export const MAX_SELECTIONS: Record<BetType, number> = {
  simple_group: 1,
  dozen: 2,
  hundred: 3,
  thousand: 4,
  group_double: 2,
  group_triple: 3,
};

export const PERIOD_LIMITS = {
  morning: "11:00",
  afternoon: "15:00",
  evening: "19:00",
  night: "22:00",
} as const;

export const BET_MULTIPLIERS: Record<BetType, number> = {
  simple_group: 9,
  dozen: 30,
  hundred: 300,
  thousand: 2000,
  group_double: 150,
  group_triple: 250,
};

export const DRAW_PERIODS = {
  morning: "Manhã (até 11h)",
  afternoon: "Tarde (até 15h)",
  evening: "Noite (até 19h)",
  night: "Corujinha (até 22h)",
} as const;