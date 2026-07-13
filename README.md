# Chacal Wallet Manager 🐺

Plataforma profissional completa para gerenciamento de múltiplas carteiras **Solana**.

### Tecnologias Principais
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Blockchain**: @solana/web3.js + @solana/spl-token
- **Infraestrutura**: Docker + Docker Compose

### Funcionalidades
- Login com JWT + Refresh Token
- Níveis de acesso (Master, Admin, Operator, Auditor)
- Criação, importação e gerenciamento de carteiras Solana
- Transferências seguras entre carteiras
- **Consolidação em massa** (todas → carteira principal)
- **Compra e Venda em massa**
- Dashboard completo com gráficos
- Histórico e Logs de auditoria
- Backup e Restore criptografado

---

## Como Rodar

```bash
docker compose up --build
