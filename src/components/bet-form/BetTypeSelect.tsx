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
  const [activeBetTypes, setActiveBetTypes] = useState<BetTypeSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBetTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('bet_type_settings')
          .select('bet_type, is_active')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching bet types:', error);
          return;
        }

        setActiveBetTypes(data || []);
      } catch (error) {
        console.error('Error in fetchActiveBetTypes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBetTypes();
  }, []);

  // If the current betType is not active, select the first active type
  useEffect(() => {
    if (!isLoading && activeBetTypes.length > 0) {
      const isCurrentTypeActive = activeBetTypes.some(t => t.bet_type === betType);
      if (!isCurrentTypeActive) {
        onBetTypeChange(activeBetTypes[0].bet_type);
      }
    }
  }, [activeBetTypes, betType, isLoading, onBetTypeChange]);

  const getBetTypeLabel = (type: BetType): string => {
    switch (type) {
      case "simple_group":
        return "Grupo Simples";
      case "dozen":
        return "Dezena";
      case "hundred":
        return "Centena";
      case "thousand":
        return "Milhar";
      case "group_double":
        return "Duque de Grupo";
      case "group_triple":
        return "Terno de Grupo";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de Aposta</Label>
        <Select disabled value={betType}>
          <SelectTrigger className="w-full border-2 border-gray-200 rounded-md shadow-sm">
            <SelectValue>Carregando...</SelectValue>
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tipo de Aposta</Label>
      <Select 
        value={betType} 
        onValueChange={(value) => onBetTypeChange(value as BetType)}
      >
        <SelectTrigger className="w-full border-2 border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-heart-pink focus:ring-heart-pink">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {activeBetTypes.map((type) => (
            <SelectItem 
              key={type.bet_type} 
              value={type.bet_type}
            >
              {getBetTypeLabel(type.bet_type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};