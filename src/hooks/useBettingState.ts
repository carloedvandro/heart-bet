import { useState } from "react";
import { BetType, DrawPeriod, Position } from "@/types/betting";

export const useBettingState = () => {
  const [selectedHearts, setSelectedHearts] = useState<string[]>([]);
  const [mainHeart, setMainHeart] = useState<string | null>(null);
  const [betType, setBetType] = useState<BetType>("simple_group");
  const [drawPeriod, setDrawPeriod] = useState<DrawPeriod>("morning");
  const [betAmount, setBetAmount] = useState<number>(10);
  const [position, setPosition] = useState<Position>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
    selectedHearts,
    setSelectedHearts,
    mainHeart,
    setMainHeart,
    betType,
    setBetType,
    drawPeriod,
    setDrawPeriod,
    betAmount,
    setBetAmount,
    position,
    setPosition,
    isSubmitting,
    setIsSubmitting,
  };
};