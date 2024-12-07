// Fixed mapping between heart colors and numbers (based on Jogo do Bicho)
const heartNumberMapping: { [key: string]: number } = {
  white: 0,     // Branco
  yellow: 4,    // Amarelo
  green: 5,     // Verde
  purple: 6,    // Roxo
  pink: 7,      // Rosa
  brown: 8,     // Marrom
  gray: 9,      // Cinza
  red: 1,       // Vermelho
  blue: 2,      // Azul
  black: 3,     // Preto
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