import { memo, useState, useEffect } from "react";
import { HEART_COLORS, BetType, DrawPeriod } from "@/types/betting";
import HeartButton from "../HeartButton";
import { useSession } from "@supabase/auth-helpers-react";
import { useBetSubmission } from "@/hooks/useBetSubmission";
import SubmitButton from "./SubmitButton";
import { useTemporaryBetState } from "@/hooks/useTemporaryBetState";

interface BettingHeartGridProps {
  betType: BetType;
  drawPeriod: DrawPeriod;  // Updated to use DrawPeriod type
  betAmount: number;
  position: number;
  onClearSelection?: () => void;
}

const BettingHeartGrid = memo(({ 
  betType, 
  drawPeriod, 
  betAmount, 
  position,
  onClearSelection 
}: BettingHeartGridProps) => {
  const [shuffledHearts, setShuffledHearts] = useState([...HEART_COLORS]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [mainHeart, setMainHeart] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { combinations } = useTemporaryBetState();

  const shuffleHearts = () => {
    setIsShuffling(true);
    const shuffled = [...shuffledHearts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledHearts(shuffled);
    setTimeout(() => setIsShuffling(false), 500);
  };

  const handleHeartClick = (color: string) => {
    if (isShuffling) return;

    if (betType === "simple_group") {
      if (!mainHeart) {
        setMainHeart(color);
        setSelectedHearts([color]);
      } else {
        if (!selectedHearts.includes(color)) {
          setSelectedHearts([...selectedHearts, color]);
        }
      }
    } else {
      if (!selectedHearts.includes(color)) {
        setSelectedHearts([...selectedHearts, color]);
      }
    }
  };

  useEffect(() => {
    clearSelections();
  }, [betType]);

  const clearSelections = () => {
    console.log("Limpando seleções no grid");
    setSelectedHearts([]);
    setMainHeart(null);
    if (onClearSelection) {
      onClearSelection();
    }
  };

  useEffect(() => {
    shuffleHearts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      shuffleHearts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const { handleSubmit } = useBetSubmission(
    session,
    selectedHearts,
    mainHeart,
    betType,
    drawPeriod,
    betAmount,
    position,
    isSubmitting,
    setIsSubmitting,
    () => {}
  );

  return (
    <div className="flex flex-col gap-8 items-center animate-fade-in">
      <div className="grid grid-cols-5 gap-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg">
        {shuffledHearts.map(({ color }) => (
          <HeartButton
            key={color}
            color={color}
            selected={selectedHearts.includes(color)}
            isMain={mainHeart === color}
            onClick={() => handleHeartClick(color)}
            disabled={isShuffling}
          />
        ))}
      </div>

      <SubmitButton
        session={session}
        selectedHearts={selectedHearts}
        mainHeart={mainHeart}
        betType={betType}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

BettingHeartGrid.displayName = "BettingHeartGrid";

export default BettingHeartGrid;