import { useState } from "react";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, handleAdminSignIn } = useAdminAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAdminSignIn(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}