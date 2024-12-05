import { CardHeader, CardTitle } from "@/components/ui/card";

export function LoginHeader() {
  return (
    <CardHeader className="space-y-2">
      <h2 className="text-center text-lg text-gray-600">Bem-vindo</h2>
      <CardTitle className="text-center text-2xl font-bold">
        Loto Corações Premiados
      </CardTitle>
    </CardHeader>
  );
}