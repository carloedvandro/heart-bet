import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export function AdminPixCodes() {
  const [newCode, setNewCode] = useState("");
  const [newValue, setNewValue] = useState("");
  const queryClient = useQueryClient();

  const { data: pixCodes, isLoading } = useQuery({
    queryKey: ['pix-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pix_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const addPixCode = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('pix_codes')
        .insert([{ 
          code: newCode,
          value: parseFloat(newValue),
          status: 'available'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pix-codes'] });
      setNewCode("");
      setNewValue("");
      toast({
        title: "Sucesso",
        description: "Código PIX adicionado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao adicionar código PIX: " + error.message
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newValue) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos"
      });
      return;
    }
    addPixCode.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Códigos PIX</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium text-gray-700">
            Código PIX
          </label>
          <Input
            id="code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Cole o código PIX aqui"
            className="w-96"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="value" className="text-sm font-medium text-gray-700">
            Valor
          </label>
          <Input
            id="value"
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-32"
          />
        </div>
        <Button type="submit" disabled={addPixCode.isPending}>
          Adicionar
        </Button>
      </form>

      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pixCodes?.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono">{code.code}</TableCell>
                <TableCell>R$ {code.value.toFixed(2)}</TableCell>
                <TableCell>{code.status}</TableCell>
                <TableCell>
                  {new Date(code.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}