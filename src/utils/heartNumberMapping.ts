// Mapeamento de cores dos corações para números
const heartToNumber: Record<string, number> = {
  "white": 0,
  "red": 1,
  "blue": 2,
  "black": 3,
  "yellow": 4,
  "green": 5,
  "purple": 6,
  "pink": 7,
  "brown": 8,
  "gray": 9,
};

// Mapeamento inverso de números para cores dos corações
const numberToHeart: Record<number, string> = {
  0: "white",
  1: "red",
  2: "blue",
  3: "black",
  4: "yellow",
  5: "green",
  6: "purple",
  7: "pink",
  8: "brown",
  9: "gray",
};

export const getNumberForHeart = (color: string): number => {
  return heartToNumber[color] ?? 0;
};

export const getHeartForNumber = (number: number): string => {
  return numberToHeart[number] ?? "white";
};