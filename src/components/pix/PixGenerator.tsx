import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export function PixGenerator() {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pixData, setPixData] = useState<{
    qrCode: string;
    pixCode: string;
  } | null>(null)

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || isNaN(Number(amount))) {
      toast.error('Por favor, insira um valor válido')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-pix', {
        body: { amount: Number(amount) }
      })

      if (error) throw error

      if (data.success) {
        setPixData({
          qrCode: data.qrCode,
          pixCode: data.pixCode
        })
        toast.success('PIX gerado com sucesso!')
      } else {
        throw new Error(data.error || 'Erro ao gerar PIX')
      }
    } catch (error) {
      console.error('Error generating PIX:', error)
      toast.error('Erro ao gerar o PIX. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyPixCode = () => {
    if (pixData?.pixCode) {
      navigator.clipboard.writeText(pixData.pixCode)
      toast.success('Código PIX copiado!')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Gerar PIX</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGeneratePix} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Valor
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Digite o valor"
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              'Gerar PIX'
            )}
          </Button>
        </form>

        {pixData && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${pixData.qrCode}`}
                alt="QR Code do PIX"
                className="max-w-[200px]"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Código PIX:</p>
              <div className="flex gap-2">
                <Input
                  value={pixData.pixCode}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyPixCode} type="button">
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}