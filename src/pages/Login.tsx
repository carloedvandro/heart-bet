import { Card, CardContent } from "@/components/ui/card";
import { AuthConfig } from "@/components/auth/AuthConfig";
import { LoginBackground } from "@/components/login/LoginBackground";
import { LoginHeader } from "@/components/login/LoginHeader";
import { LoginRedirect } from "@/components/login/LoginRedirect";
import { useLoginSession } from "@/components/login/useLoginSession";

export default function Login() {
  useLoginSession();
  
  return (
    <>
      <LoginRedirect />
      
      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: 'url("/lovable-uploads/5a0e0336-aecf-49bc-961c-013d9aee3443.png")',
        }}
      >
        <LoginBackground />

        <div className="relative z-10 w-full max-w-md space-y-4">
          <LoginHeader />
          
          <Card className="bg-white/95 animate-fade-in-up">
            <CardContent className="pt-6 relative">
              <AuthConfig />
              <div className="text-center mt-4">
                <p className="text-xs text-gray-400 opacity-70">
                  created by Lovablebr.dev
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}