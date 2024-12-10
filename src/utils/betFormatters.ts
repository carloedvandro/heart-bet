import { BetType, DrawPeriod } from "@/types/betting";

export const getBetTypeName = (type: BetType): string => {
  const names: Record<BetType, string> = {
    simple_group: 'Grupo Simples',
    dozen: 'Dezena',
    hundred: 'Centena',
    thousand: 'Milhar'
  };
  return names[type];
};

export const getDrawPeriodName = (period: DrawPeriod): string => {
  const names: Record<DrawPeriod, string> = {
    morning: 'Manhã (11h)',
    afternoon: 'Tarde (15h)',
    evening: 'Noite (19h)',
    night: 'Corujinha (22h)'
  };
  return names[period];
};