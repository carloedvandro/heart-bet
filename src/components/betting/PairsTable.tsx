import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";
import { getNumberForHeart } from "@/utils/heartNumberMapping";
import { getGroupNumbers } from "@/utils/bichoUtils";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
}

const PairsTable = ({ mainHeart, selectedPairs }: PairsTableProps) => {
  // Obtém o número do coração principal
  const mainNumber = mainHeart ? getNumberForHeart(mainHeart) : null;
  
  // Obtém todos os números do grupo se houver um coração principal
  const groupNumbers = mainNumber ? getGroupNumbers(mainNumber) : [];

  // Cria um array de 4 posições para os pares
  const pairs = groupNumbers.map((number, index) => {
    const pairedHeart = selectedPairs[index] || null;
    let numberPair = null;

    if (mainHeart && pairedHeart) {
      const mainNumber = getNumberForHeart(mainHeart);
      const pairNumber = getNumberForHeart(pairedHeart);
      numberPair = `${number}`;
    }

    return {
      id: index + 1,
      mainHeart,
      pairedHeart,
      numberPair,
      groupNumber: number
    };
  });

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
          {pairs.map(({ id, mainHeart, pairedHeart, groupNumber }) => (
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
                {groupNumber.toString().padStart(2, '0')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PairsTable;