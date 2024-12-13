import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BetType } from "@/types/betting";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBetTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('bet_type_settings')
          .select('bet_type, is_active')
          .eq('is_active', true);

        if (error) {
          console.error('Erro ao buscar tipos de apostas:', error);
          return;
        }

        const activeTypes = (data as BetTypeSetting[]).map(setting => setting.bet_type);
        setActiveBetTypes(activeTypes);

        // Se o tipo atual não estiver ativo, seleciona o primeiro tipo ativo
        if (activeTypes.length > 0 && !activeTypes.includes(betType)) {
          onBetTypeChange(activeTypes[0]);
        }
      } catch (error) {
        console.error('Erro ao processar tipos de apostas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBetTypes();
  }, [betType, onBetTypeChange]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de Aposta</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const getBetTypeLabel = (type: BetType): string => {
    const labels: Record<BetType, string> = {
      simple_group: 'Grupo Simples',
      dozen: 'Dezena',
      hundred: 'Centena',
      thousand: 'Milhar',
      group_double: 'Duque de Grupo',
      group_triple: 'Terno de Grupo'
    };
    return labels[type];
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tipo de Aposta</Label>
      <Select value={betType} onValueChange={(value) => onBetTypeChange(value as BetType)}>
        <SelectTrigger className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {activeBetTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {getBetTypeLabel(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};