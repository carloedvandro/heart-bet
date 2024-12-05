import { useState } from "react";
import HeartButton from "./HeartButton";
import { toast } from "sonner";

const HEART_COLORS = [
  { color: "pink", number: 0 },
  { color: "red", number: 1 },
  { color: "orange", number: 2 },
  { color: "yellow", number: 3 },
  { color: "green", number: 4 },
  { color: "blue", number: 5 },
  { color: "purple", number: 6 },
  { color: "coral", number: 7 },
  { color: "indigo", number: 8 },
  { color: "crimson", number: 9 },
];

const MAX_SELECTIONS = 5;

const HeartGrid = () => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);

  const handleHeartClick = (color: string) => {
    setSelectedHearts((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      }
      if (prev.length >= MAX_SELECTIONS) {
        toast.error(`Máximo de ${MAX_SELECTIONS} corações permitidos`);
        return prev;
      }
      return [...prev, color];
    });
  };

  const handleSubmit = () => {
    if (selectedHearts.length === 0) {
      toast.error("Selecione pelo menos um coração");
      return;
    }
    toast.success("Aposta registrada com sucesso!");
    console.log("Números selecionados:", selectedHearts.map(color => 
      HEART_COLORS.find(h => h.color === color)?.number
    ));
    setSelectedHearts([]);
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in">
        {HEART_COLORS.map(({ color }) => (
          <HeartButton
            key={color}
            color={color}
            selected={selectedHearts.includes(color)}
            onClick={() => handleHeartClick(color)}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-heart-pink to-heart-purple
                 text-white rounded-full shadow-lg hover:shadow-xl
                 transition-all duration-300 transform hover:scale-105"
      >
        Confirmar Aposta
      </button>
    </div>
  );
};

export default HeartGrid;