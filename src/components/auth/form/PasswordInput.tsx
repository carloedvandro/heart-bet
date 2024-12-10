import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

export function PasswordInput({ password, setPassword }: PasswordInputProps) {
  return (
    <div>
      <Label htmlFor="password" className="block text-gray-700 font-medium mb-1">
        Senha
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
  );
}