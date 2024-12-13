import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BetType } from "@/types/betting";
import { supabase } from "@/integrations/supabase/client";

interface BetTypeSelectProps {
  betType: BetType;
  onBetTypeChange: (type: BetType) => void;
}

interface BetTypeSetting {
  bet_type: BetType;
  is_active: boolean;
}

export const BetTypeSelect = ({ betType, onBetTypeChange }: BetTypeSelectProps) => {
  const [activeBetTypes, setActiveBetTypes] = useState<BetType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBetTypes = async () => {
      setLoading(true);
      console.log("Buscando tipos de apostas ativos...");
      
      const { data, error } = await supabase
        .from('bet_type_settings')
        .select('bet_type, is_active')
        .eq('is_active', true);

      if (error) {
        console.error('Erro ao buscar tipos de apostas:', error);
        setLoading(false);
        return;
      }

      console.log("Dados recebidos:", data);
      
      if (!data || data.length === 0) {
        console.log("Nenhum tipo de aposta ativo encontrado");
        setLoading(false);
        return;
      }

      const activeTypes = (data as BetTypeSetting[]).map(setting => setting.bet_type);
      console.log("Tipos ativos:", activeTypes);
      
      setActiveBetTypes(activeTypes);

      // Se o tipo atual não estiver ativo, selecione o primeiro tipo ativo
      if (activeTypes.length > 0 && !activeTypes.includes(betType)) {
        console.log("Tipo atual não está ativo, selecionando primeiro tipo:", activeTypes[0]);
        onBetTypeChange(activeTypes[0]);
      }

      setLoading(false);
    };

    fetchActiveBetTypes();
  }, [betType, onBetTypeChange]);

  const getBetTypeLabel = (type: BetType): string => {
    const labels: Record<BetType, string> = {
      simple_group: "Grupo Simples",
      dozen: "Dezena",
      hundred: "Centena",
      thousand: "Milhar",
      group_double: "Duque de Grupo",
      group_triple: "Terno de Grupo"
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de Aposta</Label>
        <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tipo de Aposta</Label>
      <Select value={betType} onValueChange={(value) => onBetTypeChange(value as BetType)}>
        <SelectTrigger className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {activeBetTypes.length > 0 ? (
            activeBetTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getBetTypeLabel(type)}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="simple_group" disabled>
              Nenhum tipo de aposta ativo
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};