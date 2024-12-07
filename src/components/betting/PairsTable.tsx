import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { getGroupNumbers } from "@/utils/bichoUtils";
import { getHeartForNumber } from "@/utils/heartNumberMapping";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
}

const PairsTable = ({ mainHeart, selectedPairs }: PairsTableProps) => {
  const getGroupNumbersFromHearts = () => {
    if (mainHeart && selectedPairs.length > 0) {
      const firstNumber = getNumberForHeart(mainHeart);
      const secondNumber = getNumberForHeart(selectedPairs[0]);
      const twoDigitNumber = firstNumber * 10 + secondNumber;
      return getGroupNumbers(twoDigitNumber);
    }
    return [];
  };

  const groupNumbers = getGroupNumbersFromHearts();

  const getSecondHeartForNumber = (number: number) => {
    const secondDigit = number % 10;
    return getHeartForNumber(secondDigit);
  };

  const SplitCircle = ({ firstColor, secondColor }: { firstColor: string, secondColor: string }) => (
    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
      <div className="absolute top-0 left-0 w-full h-full">
        <div 
          className="absolute top-0 left-0 w-1/2 h-full" 
          style={{ backgroundColor: `var(--heart-${firstColor})` }}
        />
        <div 
          className="absolute top-0 right-0 w-1/2 h-full" 
          style={{ backgroundColor: `var(--heart-${secondColor})` }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Números do Grupo ({selectedPairs.length}/4)</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Principal</TableHead>
            <TableHead>Par</TableHead>
            <TableHead>Combinação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupNumbers.map((number, index) => (
            <TableRow key={index}>
              <TableCell>
                {mainHeart && (
                  <Heart
                    className="w-8 h-8"
                    fill={`var(--heart-${mainHeart})`}
                    stroke="black"
                  />
                )}
              </TableCell>
              <TableCell>
                <Heart
                  className="w-8 h-8"
                  fill={`var(--heart-${getSecondHeartForNumber(number)})`}
                  stroke="black"
                />
              </TableCell>
              <TableCell>
                <SplitCircle 
                  firstColor={mainHeart || 'white'} 
                  secondColor={getSecondHeartForNumber(number)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PairsTable;