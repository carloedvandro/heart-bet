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

  const getHeartsForNumber = (number: number) => {
    const firstDigit = Math.floor(number / 10);
    const secondDigit = number % 10;
    return {
      first: getHeartForNumber(firstDigit),
      second: getHeartForNumber(secondDigit)
    };
  };

  const SplitCircle = ({ number }: { number: number }) => {
    const { first, second } = getHeartsForNumber(number);
    return (
      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute top-0 left-0 w-1/2 h-full" 
            style={{ backgroundColor: `var(--heart-${first})` }}
          />
          <div 
            className="absolute top-0 right-0 w-1/2 h-full" 
            style={{ backgroundColor: `var(--heart-${second})` }}
          />
        </div>
      </div>
    );
  };

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
                  fill={`var(--heart-${getHeartForNumber(number % 10)})`}
                  stroke="black"
                />
              </TableCell>
              <TableCell>
                <SplitCircle number={number} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PairsTable;