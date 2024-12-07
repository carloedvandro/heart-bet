// Mapeamento dos grupos do jogo do bicho (4 números por grupo)
export const BICHO_GROUPS = [
  { start: 1, end: 4, name: "Avestruz" },
  { start: 5, end: 8, name: "Águia" },
  { start: 9, end: 12, name: "Burro" },
  { start: 13, end: 16, name: "Borboleta" },
  { start: 17, end: 20, name: "Cachorro" },
  { start: 21, end: 24, name: "Cabra" },
  { start: 25, end: 28, name: "Carneiro" },
  { start: 29, end: 32, name: "Camelo" },
  { start: 33, end: 36, name: "Cobra" },
  { start: 37, end: 40, name: "Coelho" },
  { start: 41, end: 44, name: "Cavalo" },
  { start: 45, end: 48, name: "Elefante" },
  { start: 49, end: 52, name: "Galo" },
  { start: 53, end: 56, name: "Gato" },
  { start: 57, end: 60, name: "Jacaré" },
  { start: 61, end: 64, name: "Leão" },
  { start: 65, end: 68, name: "Macaco" },
  { start: 69, end: 72, name: "Porco" },
  { start: 73, end: 76, name: "Pavão" },
  { start: 77, end: 80, name: "Peru" },
  { start: 81, end: 84, name: "Touro" },
  { start: 85, end: 88, name: "Tigre" },
  { start: 89, end: 92, name: "Urso" },
  { start: 93, end: 96, name: "Veado" },
  { start: 97, end: 0, name: "Vaca" }, // 97-00
];

// Função para encontrar o grupo baseado em um número de dois dígitos
export const findBichoGroup = (number: number) => {
  // Tratamento especial para números repetidos (00, 11, 22, etc.)
  const isRepeatedNumber = Math.floor(number / 10) === number % 10;
  if (isRepeatedNumber) {
    return {
      start: Math.floor(number / 10) * 10,
      end: Math.floor(number / 10) * 10 + 3,
      name: `Grupo ${Math.floor(number / 10)}`
    };
  }

  // Tratamento especial para 0, que pertence ao último grupo (97-00)
  if (number === 0) {
    return BICHO_GROUPS[BICHO_GROUPS.length - 1];
  }

  return BICHO_GROUPS.find(group => {
    const start = group.start;
    const end = group.end === 0 ? 100 : group.end;
    return number >= start && number <= end;
  });
};

// Função para obter todos os números de um grupo
export const getGroupNumbers = (number: number): number[] => {
  const firstDigit = Math.floor(number / 10);
  const secondDigit = number % 10;
  
  // Se for um número repetido (00, 11, 22, etc.), retorna o grupo correspondente
  if (firstDigit === secondDigit) {
    return [
      firstDigit * 10 + 0,
      firstDigit * 10 + 1,
      firstDigit * 10 + 2,
      firstDigit * 10 + 3
    ];
  }

  // Encontra o grupo ao qual o número pertence
  const group = findBichoGroup(number);
  if (!group) return [];

  if (group.end === 0) { // Caso especial para o grupo 97-00
    return [97, 98, 99, 0];
  }

  // Retorna a sequência correta do grupo
  return [
    group.start,
    group.start + 1,
    group.start + 2,
    group.start + 3
  ];
};

// Função para verificar se dois números pertencem ao mesmo grupo
export const areNumbersInSameGroup = (num1: number, num2: number): boolean => {
  const group1 = findBichoGroup(num1);
  const group2 = findBichoGroup(num2);
  return group1?.start === group2?.start;
};