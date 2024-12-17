export const formatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

export const validateCPFFormat = (cpf: string): boolean => {
  const cleanCPF = formatCPF(cpf);
  return cleanCPF.length === 11;
};