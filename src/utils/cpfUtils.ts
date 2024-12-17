export const formatCPF = (cpf: string): string => {
  // Remove any non-numeric characters
  return cpf.replace(/\D/g, '');
};

export const validateCPF = async (supabase: any, cpf: string): Promise<boolean> => {
  const formattedCPF = formatCPF(cpf);
  const { data, error } = await supabase
    .from('financial_profiles')
    .select('id')
    .eq('cpf', formattedCPF);
    
  if (error) {
    console.error('Error checking CPF:', error);
    throw error;
  }
  
  return data && data.length > 0;
};