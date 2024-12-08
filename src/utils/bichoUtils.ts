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
  console.log("🔍 Finding group for number:", number);
  
  // Tratamento especial para zero
  if (number === 0) {
    console.log("🎯 Special case: number is 0, returning last group (Vaca)");
    return BICHO_GROUPS[BICHO_GROUPS.length - 1];
  }

  // Encontrar o grupo correto baseado no número
  const group = BICHO_GROUPS.find(group => {
    if (group.end === 0) {
      // Caso especial para o último grupo (97-00)
      return number >= 97 || number === 0;
    }
    return number >= group.start && number <= group.end;
  });

  console.log("🎯 Found group:", group);
  return group;
};

// Função para obter todos os números de um grupo
export const getGroupNumbers = (number: number): number[] => {
  console.log("🎲 Getting group numbers for:", number);

  // Tratamento especial para quando o número é 0 (00)
  if (number === 0) {
    console.log("🎲 Special case: number is 0, returning group [97, 98, 99, 0]");
    return [97, 98, 99, 0];
  }

  const group = findBichoGroup(number);
  if (!group) {
    console.log("❌ No group found for number:", number);
    return [];
  }

  // Se for o último grupo (97-00)
  if (group.end === 0) {
    console.log("🎲 Last group case, returning [97, 98, 99, 0]");
    return [97, 98, 99, 0];
  }

  // Para qualquer outro grupo, retorna os 4 números começando do start
  const numbers = [
    group.start,
    group.start + 1,
    group.start + 2,
    group.start + 3
  ];
  console.log("🎲 Returning group numbers:", numbers);
  return numbers;
};

// Função para verificar se dois números pertencem ao mesmo grupo
export const areNumbersInSameGroup = (num1: number, num2: number): boolean => {
  const group1 = findBichoGroup(num1);
  const group2 = findBichoGroup(num2);
  return group1?.start === group2?.start;
};