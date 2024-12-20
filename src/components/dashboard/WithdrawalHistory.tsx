import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function WithdrawalHistory() {
  const { data: withdrawals } = useQuery({
    queryKey: ['withdrawal-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (!withdrawals?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-gray-700">Minhas Solicitações</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {withdrawals.map((withdrawal) => (
          <div
            key={withdrawal.id}
            className="text-sm p-2 bg-gray-50 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                R$ {withdrawal.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(withdrawal.created_at), "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              withdrawal.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800'
                : withdrawal.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {withdrawal.status === 'pending' ? 'Pendente' : 
               withdrawal.status === 'completed' ? 'Concluído' : 'Rejeitado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}