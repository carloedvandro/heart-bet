import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

export function EmailInput({ email, setEmail }: EmailInputProps) {
  return (
    <div>
      <Label htmlFor="email" className="block text-gray-700 font-medium mb-1">
        Email
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
  );
}