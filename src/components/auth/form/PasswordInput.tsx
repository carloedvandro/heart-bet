import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

export function PasswordInput({ password, setPassword }: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Senha</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full"
      />
    </div>
  );
}