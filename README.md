# EquiTrade
<p align="center">
  <!-- Substitua o caminho abaixo pela sua logo (ex.: /assets/logo.png ou /docs/logo.png) -->
  <img src="docs/logo.png" alt="EquiTrade Logo" width="240" />
</p>

# EquiTrade

Uma plataforma para troca e venda responsável de cavalos. O EquiTrade conecta proprietários, criadores e entusiastas para facilitar negociações seguras, com informações completas sobre cada animal.

Status: WIP (Work in progress)

Badges:
- version: ![version](https://img.shields.io/badge/version-0.1.0-lightgrey)

Visão geral
- Público-alvo: criadores, proprietários e amantes de equinos.
- Objetivo: facilitar vendas com transparência (pedigree, saúde, vacinas, imagens/vídeos, histórico de competições, avaliações).
- Principais diferenciais: perfis detalhados por animal, sistema de mensagens seguro entre usuários, filtros avançados por raça, idade, uso e localização.

Funcionalidades principais
- Cadastro e perfis de usuários (comprador, vendedor, criador).
- Anúncios por cavalo com fotos, vídeos, documentos e histórico.
- Busca e filtros avançados (raça, idade, sexo, localidade, propósito: esporte/lancha/recreio).
- Sistema de mensagens internas e propostas.

## Tecnologias
- **Frontend:** (Em desenvolvimento)
- **Backend:** Node.js, Express, TypeScript
- **Banco de dados:** PostgreSQL, TypeORM
- **Organização:** Estrutura modular com separação de responsabilidades
- Armazenamento de mídia: (Em desenvolvimento)
- Autenticação: (Em desenvolvimento)
- CI/CD: GitHub Actions
- Testes: (Em desenvolvimento)

## 🚀 Como usar

### Pré-requisitos
- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)

### Configuração do Banco de Dados
```bash
# Instalar PostgreSQL (macOS com Homebrew)
brew install postgresql
brew services start postgresql

# Criar banco de dados
createdb equitrade

# Criar usuário postgres (se necessário)
createuser -s postgres
```

### Desenvolvimento
```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/EquiTrade.git
cd EquiTrade

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações de banco

# Povoar banco com dados iniciais (opcional)
npm run db:seed

# Desenvolvimento (executa TypeScript diretamente)
npm run dev

# Desenvolvimento com auto-restart
npm run dev:watch
```

### Produção
```bash
# Compilar TypeScript
npm run build

# Executar versão compilada
npm start
```

### Scripts disponíveis
- `npm run dev` - Executa o servidor em modo desenvolvimento
- `npm run dev:watch` - Executa com auto-restart quando arquivos mudam
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Executa a versão compilada (produção)
- `npm run db:seed` - Popula o banco com dados iniciais
- `npm run db:reset` - Limpa e repovoar o banco de dados


Contato
- Autor: SEU_NOME (substitua aqui)
- Email: seu-email@exemplo.com
- Repositório: https://github.com/SEU_USUARIO/EquiTrade
