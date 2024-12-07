import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { getGroupNumbers } from "@/utils/bichoUtils";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
}

const PairsTable = ({ mainHeart, selectedPairs }: PairsTableProps) => {
  // Obtém os números do grupo quando temos dois corações selecionados
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

  return (
    <div className="w-full bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Números do Grupo ({selectedPairs.length}/4)</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Principal</TableHead>
            <TableHead>Par</TableHead>
            <TableHead>Número do Grupo</TableHead>
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
                {index === 0 && selectedPairs[0] && (
                  <Heart
                    className="w-8 h-8"
                    fill={`var(--heart-${selectedPairs[0]})`}
                    stroke="black"
                  />
                )}
              </TableCell>
              <TableCell className="font-mono text-lg">
                {number.toString().padStart(2, '0')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PairsTable;