import { HEART_COLORS } from "@/types/betting";

let currentMapping: { [key: string]: number } = {};

// Inicializa o mapeamento
const initializeMapping = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i);
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
  
  currentMapping = HEART_COLORS.reduce((acc, heart, index) => ({
    ...acc,
    [heart.color]: shuffledNumbers[index]
  }), {});

  console.log("New heart mapping generated:", currentMapping);
};

// Atualiza o mapeamento a cada 3 segundos
setInterval(initializeMapping, 3000);

// Inicializa o primeiro mapeamento
initializeMapping();

export const getNumberForHeart = (color: string): number => {
  return currentMapping[color] ?? 0;
};