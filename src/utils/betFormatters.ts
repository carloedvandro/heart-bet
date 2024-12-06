export const getBetTypeName = (type: string): string => {
  const names: Record<string, string> = {
    simple_group: "Grupo Simples",
    dozen: "Dezena",
    hundred: "Centena",
    thousand: "Milhar",
    group_double: "Duque de Grupo",
    group_triple: "Terno de Grupo",
  };
  return names[type] || type;
};

export const getDrawPeriodName = (period: string): string => {
  const names: Record<string, string> = {
    morning: "Manhã",
    afternoon: "Tarde",
    evening: "Noite",
    night: "Corujinha",
  };
  return names[period] || period;
};