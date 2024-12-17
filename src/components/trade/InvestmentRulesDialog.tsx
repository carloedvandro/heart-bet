import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvestmentRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestmentRulesDialog({ open, onOpenChange }: InvestmentRulesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Regras do Investimento Trade</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-100px)] pr-4">
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4">1. Introdução</h3>
              <p className="text-gray-700 dark:text-gray-300">
                O Investimento Trade é uma modalidade de investimento oferecida dentro do sistema, onde os clientes podem transferir valores de seu saldo formal para o saldo de investimento trade. Este investimento oferece rendimentos diários baseados no valor investido e no período escolhido.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Utilizamos a maior tecnologia do mercado com sistemas de inteligência artificial avançada para garantir segurança, agilidade e precisão nas operações e cálculos.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">2. Funcionamento do Investimento Trade</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>O cliente pode optar por transferir valores do saldo formal para o saldo de investimento trade.</li>
                <li>A transferência pode ser realizada após o aceite dos termos e condições e o preenchimento obrigatório do cadastro financeiro.</li>
                <li>O saldo investido terá rendimentos diários, conforme o período de bloqueio escolhido pelo cliente:</li>
                <ul className="list-none pl-6 space-y-1 mt-2">
                  <li>• De 7 a 29 dias: Rendimento de 0,5% ao dia sobre o valor investido.</li>
                  <li>• 30 dias ou mais: Rendimento de 1% ao dia sobre o valor investido.</li>
                </ul>
                <li>Nossos sistemas com inteligência artificial avançada monitoram continuamente os cálculos e operações para garantir o melhor desempenho e máxima segurança.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">3. Operação Diária Obrigatória</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <ul className="list-disc pl-6 space-y-2">
                  <li>O cliente é obrigado a clicar no botão "Operar Mercado" uma vez por dia para ativar o rendimento diário.</li>
                  <li>Após o cliente clicar no botão, um cronômetro regressivo de 24 horas será iniciado.</li>
                  <li>Caso o cliente esqueça de operar dentro do prazo de 24 horas, o rendimento ficará disponível somente após uma nova operação no dia seguinte, e o horário limite será sempre adiado de acordo com o atraso.</li>
                </ul>
                <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg mt-2">
                  <p className="font-semibold mb-2">Exemplo:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Se o cliente operar hoje às 10:00, ele precisará operar novamente até as 10:00 do dia seguinte.</li>
                    <li>Caso esqueça e opere apenas às 12:00, o cronômetro será reiniciado para as 12:00 do próximo dia.</li>
                  </ul>
                </div>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  Importante: O cliente não receberá o rendimento do dia caso não realize a operação no botão "Operar Mercado" dentro do prazo de 24 horas.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">4. Período de Bloqueio</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Ao transferir valores para o investimento trade, o saldo ficará bloqueado durante o período escolhido:</li>
                <ul className="list-none pl-6 space-y-1 mt-2">
                  <li>• Mínimo de 7 dias.</li>
                  <li>• 30 dias ou mais para obter rendimento maior.</li>
                </ul>
                <li>Durante o período de bloqueio, o cliente não poderá transferir ou sacar o valor investido.</li>
                <li>Após o término do período escolhido, o saldo ficará liberado para transferências ou saques.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">5. Cadastro de Movimentação Financeira</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Antes de realizar qualquer transferência para o saldo de investimento trade, o cliente deverá preencher um cadastro obrigatório, incluindo os seguintes dados:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Nome completo.</li>
                <li>CPF (validado para garantir que pertence ao usuário logado).</li>
                <li>WhatsApp ou número de telefone.</li>
                <li>Tipo de chave Pix (CPF, CNPJ, e-mail, telefone ou chave aleatória).</li>
                <li>Chave Pix.</li>
                <li>Endereço completo (rua, número, bairro, cidade, estado e CEP).</li>
                <li>Data de nascimento.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                O sistema validará as informações, especialmente o CPF, para garantir que todas as movimentações estejam associadas ao mesmo cliente.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">6. Acompanhamento dos Rendimentos</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>O cliente poderá acompanhar o saldo e os rendimentos acumulados diretamente na área de Investimento Trade.</li>
                <li>O rendimento será adicionado ao saldo de investimento trade somente após o cliente clicar no botão "Operar Mercado" dentro do prazo de 24 horas.</li>
                <li>Nossa inteligência artificial avançada assegura que os rendimentos sejam calculados e creditados com máxima precisão e confiabilidade.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">7. Solicitação de Saque</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                O cliente poderá solicitar o saque do saldo de investimento trade apenas após o período de bloqueio escolhido.
              </p>
              <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg">
                <p className="font-semibold mb-2">Condições do saque:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Solicitações podem ser feitas somente às sextas-feiras.</li>
                  <li>O pagamento será processado e concluído até a terça-feira seguinte.</li>
                  <li>Será cobrada uma taxa de 5% sobre o valor solicitado para saque.</li>
                  <li>O valor sacado será transferido somente para contas vinculadas ao CPF do cliente cadastrado.</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">8. Aceite dos Termos e Condições</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Antes de prosseguir com a transferência para o investimento trade, o cliente deverá:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Ler e aceitar os termos e condições descritos nesta funcionalidade.</li>
                <li>Confirmar que está ciente dos riscos associados ao mercado de investimentos, marcando a opção:
                  <p className="font-semibold mt-1">"Estou ciente do risco do mercado trade e estou de acordo."</p>
                </li>
                <li>Preencher todos os dados exigidos no cadastro financeiro.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">9. Aviso de Risco</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>O Investimento Trade é uma operação sujeita a riscos, incluindo a possibilidade de perda parcial ou total do valor investido.</li>
                <li>Rendimentos passados não garantem resultados futuros.</li>
                <li>O cliente confirma que compreende os riscos envolvidos ao aceitar os termos e realizar a transferência.</li>
                <li>O Investimento Trade é uma funcionalidade limitada e poderá ser retirada do sistema sem aviso prévio.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">10. Restrição de Contas</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Todas as movimentações financeiras (transferências e saques) deverão ser realizadas exclusivamente para contas associadas ao CPF cadastrado no sistema.</li>
                <li>Isso garante a segurança e autenticidade das operações realizadas.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">11. Resumo do Processo</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><span className="font-semibold">Preenchimento de Cadastro:</span> O cliente insere os dados financeiros obrigatórios.</li>
                <li><span className="font-semibold">Aceite dos Termos:</span> O cliente lê e aceita as regras e os riscos.</li>
                <li><span className="font-semibold">Transferência do Saldo:</span> O cliente transfere o valor do saldo formal para o saldo trade.</li>
                <li><span className="font-semibold">Operação Diária:</span> O cliente clica no botão "Operar Mercado" uma vez ao dia.</li>
                <li><span className="font-semibold">Bloqueio do Saldo:</span> O saldo fica bloqueado pelo período escolhido (7 dias ou 30 dias).</li>
                <li><span className="font-semibold">Rendimentos Diários:</span> O sistema calcula e adiciona o rendimento diário ao saldo trade após a operação.</li>
                <li><span className="font-semibold">Solicitação de Saque:</span> O cliente solicita o saque conforme as regras (sextas-feiras, com pagamento até terça-feira seguinte).</li>
                <li><span className="font-semibold">Taxa de Saque:</span> Aplicação de 5% sobre o valor retirado.</li>
              </ol>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">12. Considerações Finais</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Utilizamos a mais avançada tecnologia com inteligência artificial para proporcionar transparência, segurança e precisão em todas as operações do Investimento Trade.
                </p>
                <p>
                  O cliente declara estar ciente de todas as condições, regras e riscos ao aceitar os termos e realizar a transferência. A operação diária obrigatória é parte integrante do processo e o cliente deve operar dentro do prazo de 24 horas para garantir os rendimentos.
                </p>
                <p className="font-semibold">
                  Essas são as regras gerais que garantem o funcionamento organizado e seguro do Investimento Trade.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}