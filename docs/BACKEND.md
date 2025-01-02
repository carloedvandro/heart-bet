### Backend (Supabase)
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage
- **Edge Functions**: Deno Runtime
- **Segurança**: Row Level Security (RLS)
- **API**: REST via Supabase Client

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