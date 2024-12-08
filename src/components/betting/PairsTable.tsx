import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BetType } from "@/types/betting";
import { getNumberForHeart } from "@/utils/heartNumberMapping";

interface PairsTableProps {
  mainHeart: string | null;
  selectedPairs: string[];
  betType: BetType;
}

const PairsTable = ({ mainHeart, selectedPairs, betType }: PairsTableProps) => {
  // Se for aposta do tipo dezena ou centena, mostra a tabela simplificada
  if (betType === "dozen" || betType === "hundred") {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Números</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center text-lg font-semibold">
              {selectedPairs.length === 0 ? (
                <span className="text-gray-500">Selecione os corações</span>
              ) : (
                <div className="flex justify-center gap-1">
                  {selectedPairs.map((heart, index) => (
                    <span key={index}>{getNumberForHeart(heart)}</span>
                  ))}
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  // Para grupo simples, mantém a tabela original
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Grupo</TableHead>
          <TableHead className="text-center">Par</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-center text-lg font-semibold">
            {mainHeart ? (
              <span>{getNumberForHeart(mainHeart)}</span>
            ) : (
              <span className="text-gray-500">Selecione o primeiro coração</span>
            )}
          </TableCell>
          <TableCell className="text-center text-lg font-semibold">
            {selectedPairs.length > 0 ? (
              selectedPairs.map((pair, index) => (
                <span key={index}>{getNumberForHeart(pair)}</span>
              ))
            ) : (
              <span className="text-gray-500">Selecione o segundo coração</span>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PairsTable;