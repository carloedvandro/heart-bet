import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { DollarSign } from "lucide-react"
import { useState } from "react"

export function DollarValueButton() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('scrape-dollar')
      
      if (error) throw error

      if (data?.success && data?.data?.[0]?.content) {
        toast({
          title: "Valor do Dólar",
          description: `R$ ${data.data[0].content}`,
          duration: 5000,
        })
      } else {
        throw new Error('Não foi possível obter o valor do dólar')
      }
    } catch (error) {
      console.error('Error fetching dollar value:', error)
      toast({
        title: "Erro",
        description: "Não foi possível obter o valor do dólar",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
    >
      <DollarSign className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  )
}