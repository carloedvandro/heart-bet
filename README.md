# Sistema Administrativo - Corações Premiados

## Visão Geral
Sistema completo de gestão de apostas e investimentos com autenticação, gestão de usuários, processamento de pagamentos e operações financeiras.

## Stack Tecnológica

### Frontend
- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **UI Framework**: 
  - Tailwind CSS para estilização
  - shadcn/ui para componentes base
- **Gerenciamento de Estado**: 
  - TanStack Query (React Query) para cache e gerenciamento de dados
  - Zustand para estado global
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form com Zod para validação
- **Notificações**: Sonner para toasts

### Backend (Supabase)
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **Edge Functions**: Deno Runtime
- **Segurança**: Row Level Security (RLS)
- **API**: REST via Supabase Client

## Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── auth/          # Componentes de autenticação
│   ├── dashboard/     # Componentes do painel
│   ├── trade/         # Componentes de investimentos
│   └── ui/            # Componentes base (shadcn)
├── hooks/             # Hooks customizados
├── integrations/      # Integrações (Supabase)
├── pages/             # Páginas da aplicação
├── types/            # Tipos TypeScript
└── utils/            # Utilitários
```

## Funcionalidades Principais

### 1. Autenticação
- Login/Registro com email/senha
- Recuperação de senha
- Proteção de rotas
- Perfil financeiro obrigatório

### 2. Gestão de Apostas
- Criação e visualização de apostas
- Histórico de apostas
- Resultados em tempo real
- Exportação de relatórios

### 3. Sistema de Investimentos
- Criação de investimentos
- Rendimentos diários automáticos
- Operações de trade
- Saques e cancelamentos

### 4. Gestão Financeira
- Saldo em conta
- Histórico de transações
- Recargas via PIX/Binance
- Comprovantes de pagamento

## Segurança

### Autenticação
- Tokens JWT via Supabase Auth
- Sessões persistentes
- Refresh tokens automáticos
- Proteção contra CSRF

### Banco de Dados
- Row Level Security (RLS) em todas as tabelas
- Políticas por usuário/admin
- Funções com SECURITY DEFINER
- Validações em nível de banco

### API
- Rate limiting
- Validação de inputs
- Sanitização de dados
- Logs de auditoria

## Estrutura do Banco de Dados

### Tabelas Principais
1. **profiles**
   - Dados básicos do usuário
   - Saldo e status admin

2. **financial_profiles**
   - Dados financeiros completos
   - Documentação e PIX

3. **bets**
   - Registro de apostas
   - Resultados e prêmios

4. **trade_investments**
   - Investimentos ativos
   - Rendimentos e status

### Tabelas de Suporte
- balance_history
- payment_proofs
- trade_operations
- trade_earnings
- trade_withdrawals

## Edge Functions

### Processamento de Pagamentos
1. **generate-asaas-payment**
   - Geração de QR Code PIX
   - Webhook de confirmação

2. **generate-binance-payment**
   - Integração Binance Pay
   - Confirmação automática

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase

### Configuração do Supabase
1. Criar novo projeto
2. Configurar autenticação
3. Aplicar migrations do banco
4. Configurar políticas RLS
5. Configurar secrets:
   - ASAAS_API_KEY
   - BINANCE_API_KEY
   - BINANCE_API_SECRET

### Configuração do Frontend
```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build
```

### Variáveis de Ambiente Necessárias
```
SUPABASE_URL=sua_url
SUPABASE_ANON_KEY=sua_chave
```

## Manutenção

### Backups
- Backup automático diário do banco
- Retenção de 7 dias
- Exportação manual disponível

### Monitoramento
- Logs de Edge Functions
- Métricas de banco de dados
- Auditoria de autenticação

### Atualizações
- Dependências via npm
- Migrations do banco
- Edge Functions

## Políticas de Segurança

### Usuários
- Acesso apenas aos próprios dados
- Limite de tentativas de login
- Validação de email

### Admins
- Acesso total ao sistema
- Logs de ações
- Gerenciamento de usuários

## Suporte

Para suporte técnico ou dúvidas:
1. Verificar logs no Supabase
2. Consultar documentação
3. Contatar equipe técnica

## Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)
- [Documentação React Query](https://tanstack.com/query)