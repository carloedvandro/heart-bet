interface PrizeStatusProps {
  prizeAmount: number | null;
  isWinner: boolean | null;
}

export const PrizeStatus = ({ prizeAmount, isWinner }: PrizeStatusProps) => {
  if (prizeAmount) {
    return (
      <span className="text-green-600 font-medium">
        R$ {Number(prizeAmount).toFixed(2)}
      </span>
    );
  }
  
  if (isWinner === false) {
    return <span className="text-red-600 font-medium">Não premiado</span>;
  }
  
  return <span>Pendente</span>;
};