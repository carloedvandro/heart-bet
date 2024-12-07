import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
}

const PairsTable = ({ mainHeart, selectedPairs }: PairsTableProps) => {
  // Cria um array de 4 posições para os pares
  const pairs = Array(4).fill(null).map((_, index) => ({
    id: index + 1,
    mainHeart,
    pairedHeart: selectedPairs[index] || null,
  }));

  return (
    <div className="w-full bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Pares Formados ({selectedPairs.length}/4)</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Principal</TableHead>
            <TableHead>Par</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairs.map(({ id, mainHeart, pairedHeart }) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PairsTable;