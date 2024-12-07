import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
}

const PairsTable = ({ mainHeart, selectedPairs }: PairsTableProps) => {
  // Cria um array de 4 posições para os pares
  const pairs = Array(4).fill(null).map((_, index) => {
    const pairedHeart = selectedPairs[index] || null;
    let numberPair = null;

    if (mainHeart && pairedHeart) {
      const mainNumber = getNumberForHeart(mainHeart);
      const pairNumber = getNumberForHeart(pairedHeart);
      // Sempre coloca o menor número primeiro
      numberPair = mainNumber < pairNumber 
        ? `${mainNumber}${pairNumber}`
        : `${pairNumber}${mainNumber}`;
    }

    return {
      id: index + 1,
      mainHeart,
      pairedHeart,
      numberPair
    };
  });

  return (
    <div className="w-full bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Pares Formados ({selectedPairs.length}/4)</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Principal</TableHead>
            <TableHead>Par</TableHead>
            <TableHead>Número</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairs.map(({ id, mainHeart, pairedHeart, numberPair }) => (
            <TableRow key={id}>
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
                {pairedHeart && (
                  <Heart
                    className="w-8 h-8"
                    fill={`var(--heart-${pairedHeart})`}
                    stroke="black"
                  />
                )}
              </TableCell>
              <TableCell className="font-mono text-lg">
                {numberPair}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PairsTable;