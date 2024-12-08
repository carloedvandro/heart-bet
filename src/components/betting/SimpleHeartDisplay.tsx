import { useState } from "react";
import HeartButton from "../HeartButton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { HEART_COLORS } from "@/types/betting";

const SimpleHeartDisplay = () => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);

  const handleHeartClick = (color: string) => {
    if (selectedHearts.includes(color)) {
      setSelectedHearts(selectedHearts.filter((h) => h !== color));
    } else if (selectedHearts.length < 2) {
      setSelectedHearts([...selectedHearts, color]);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur mt-6">
      <CardHeader>
        <CardTitle>Visualização Simplificada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Display selected numbers */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold mb-2">Números Selecionados:</p>
            <div className="text-3xl font-bold text-primary">
              {selectedHearts.length > 0 
                ? selectedHearts.map(heart => getNumberForHeart(heart)).join(" - ")
                : "Selecione os corações"}
            </div>
          </div>

          {/* Hearts grid */}
          <div className="grid grid-cols-5 gap-4 place-items-center">
            {HEART_COLORS.map(({ color }) => (
              <HeartButton
                key={color}
                color={color}
                selected={selectedHearts.includes(color)}
                onClick={() => handleHeartClick(color)}
                disabled={selectedHearts.length >= 2 && !selectedHearts.includes(color)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleHeartDisplay;