# EquiTrade
<p align="center">
  <!-- Substitua o caminho abaixo pela sua logo (ex.: /assets/logo.png ou /docs/logo.png) -->
  <img src="assets/Imagens/logo.jpeg" alt="EquiTrade Logo" width="240" />
</p>

# Descrição
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
- **Organização:** Estrutura modular com rotas organizadas e separação de responsabilidades
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

#### 🔧 **Desenvolvimento**
- `npm run dev` - **Executa o servidor em modo desenvolvimento**
  - ✅ Usa `tsx` para executar TypeScript diretamente
  - ✅ Não precisa compilar antes de executar
  - ✅ Ideal para desenvolvimento rápido
  
- `npm run dev:watch` - **Executa com auto-restart quando arquivos mudam**
  - ✅ Reinicia automaticamente ao salvar arquivos
  - ✅ Perfeito para desenvolvimento contínuo

#### 🏗️ **Build & Produção**
- `npm run build` - **Compila TypeScript para JavaScript**
  - 📦 Gera arquivos na pasta `dist/`
  - 🔍 Verifica erros de TypeScript
  - ⚠️ **Necessário apenas para produção ou verificação de tipos**
  
- `npm start` - **Executa a versão compilada (produção)**
  - 🚀 Roda o JavaScript compilado (`dist/server.js`)
  - ⚠️ **Requer `npm run build` primeiro**

#### 🗄️ **Banco de Dados**
- `npm run db:seed` - **Popula o banco com dados iniciais**
  - 👥 Cria usuários de exemplo (2 compradores, 2 vendedores)
  - 🎯 Ideal para testes e desenvolvimento
  
- `npm run db:reset` - **Limpa e repovoar o banco de dados**
  - 🗑️ Remove todos os dados existentes
  - 🌱 Recria e popula com dados frescos

#### ⚡ **Quando usar cada comando:**
- **Desenvolvimento diário**: `npm run dev` (mais rápido, não precisa de build)
- **Verificar erros**: `npm run build` (checa tipos TypeScript)
- **Deploy produção**: `npm run build` + `npm start`

## 📚 **API Documentation**

O projeto inclui documentação interativa da API usando **Swagger UI**.

### **Acessar a documentação:**
```
http://localhost:3000/docs
```

### **Funcionalidades da documentação:**
- 📋 **Lista completa de endpoints** com descrições detalhadas
- 🧪 **Testar endpoints diretamente** no navegador
- 📝 **Esquemas de dados** (DTOs) com validações
- 🔍 **Exemplos de requisições e respostas**
- 🏷️ **Organização por tags** (Users, etc.)

### **Endpoints principais disponíveis:**
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/compradores` - Listar compradores
- `GET /api/users/vendedores` - Listar vendedores  
- `GET /api/users/stats` - Estatísticas dos usuários
- `POST /api/users/compradores` - Criar comprador
- `POST /api/users/vendedores` - Criar vendedor
- `GET /api/users/{id}` - Obter usuário por ID
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Deletar usuário

### **Como usar:**
1. Inicie o servidor: `npm run dev`
2. Acesse: [http://localhost:3000/docs](http://localhost:3000/docs)
3. Explore e teste os endpoints diretamente na interface

Contato
- Autor: SEU_NOME (substitua aqui)
- Email: seu-email@exemplo.com
- Repositório: https://github.com/SEU_USUARIO/EquiTrade
