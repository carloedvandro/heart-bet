// Fixed mapping between heart colors and numbers (based on Jogo do Bicho)
const heartNumberMapping: { [key: string]: number } = {
  white: 0,     // Primeiro número (0)
  red: 5,       // Águia
  blue: 9,      // Burro
  black: 13,    // Borboleta
  yellow: 17,   // Cachorro
  green: 21,    // Cabra
  purple: 25,   // Carneiro
  pink: 29,     // Camelo
  brown: 33,    // Cobra
  gray: 37,     // Coelho
};

export const getNumberForHeart = (color: string): number => {
  return heartNumberMapping[color] ?? 0;
};

// Função para obter a cor do coração baseado no número
export const getHeartForNumber = (number: number): string | null => {
  const entries = Object.entries(heartNumberMapping);
  const found = entries.find(([_, value]) => value === number);
  return found ? found[0] : null;
};