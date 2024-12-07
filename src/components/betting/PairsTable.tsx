import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
}

const PairsTable = ({ mainHeart, selectedPairs }: PairsTableProps) => {
  if (!mainHeart) return null;

  // Cria um array de pares formatados para exibição
  const pairs = selectedPairs.map((pair, index) => ({
    id: index,
    mainHeart,
    pairedHeart: pair,
  }));

  return (
    <div className="w-full max-w-sm bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Pares Formados</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Principal</TableHead>
            <TableHead>Par</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairs.map((pair) => (
            <TableRow key={pair.id}>
              <TableCell>
                <Heart
                  className="w-8 h-8"
                  fill={`var(--heart-${pair.mainHeart})`}
                  stroke="black"
                />
              </TableCell>
              <TableCell>
                <Heart
                  className="w-8 h-8"
                  fill={`var(--heart-${pair.pairedHeart})`}
                  stroke="black"
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