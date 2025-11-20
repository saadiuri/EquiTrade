# EquiTrade Frontend

Este diretório contém todos os arquivos do frontend do EquiTrade.

## Estrutura

```
resources/
├── pages/          # Páginas HTML da aplicação
├── scripts/
│   ├── ts/         # Scripts TypeScript (código fonte)
│   └── js/         # Scripts JavaScript compilados (gerado automaticamente)
└── style/          # Arquivos CSS
```

## Scripts Disponíveis

### Compilar TypeScript
Compila os arquivos TypeScript para JavaScript:
```bash
npm run frontend:build
```

### Compilar com Watch
Compila e recompila automaticamente quando detectar mudanças nos arquivos TypeScript:
```bash
npm run frontend:watch
```

### Servir Frontend
Inicia um servidor HTTP local para servir o frontend (porta 8080):
```bash
npm run frontend:serve
```

### Desenvolvimento (Build + Serve)
Compila o TypeScript e inicia o servidor em um único comando:
```bash
npm run frontend:dev
```

## Como Usar

### Desenvolvimento Completo

Para desenvolver tanto o backend quanto o frontend:

1. **Terminal 1** - Backend com hot reload:
   ```bash
   npm run dev:watch
   ```

2. **Terminal 2** - Frontend com watch (recompila automaticamente):
   ```bash
   npm run frontend:watch
   ```

3. **Terminal 3** - Servidor frontend:
   ```bash
   npm run frontend:serve
   ```

### Acesso

Após iniciar o servidor frontend, acesse:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3333
- **API Documentation**: http://localhost:3333/api-docs

## Páginas Disponíveis

- **Página Inicial**: `/pages/paginaInicial.html`
- **Login**: `/pages/login.html`
- **Cadastro de Usuário**: `/pages/cadastroUsuario.html`
- **Cadastro de Cavalo**: `/pages/cadastroCavalo.html`
- **Busca de Cavalos**: `/pages/buscaCavalo.html`
- **Listagem de Cavalos**: `/pages/listagemCavalo.html`
- **Detalhes do Cavalo**: `/pages/detalhesCavalo.html`
- **Bate-Papo**: `/pages/batePapo.html`
- **Sobre**: `/pages/sobre.html`
- **Contato**: `/pages/contato.html`

## Notas Importantes

1. **Compilação Necessária**: Antes de servir o frontend, você precisa compilar os arquivos TypeScript. Execute `npm run frontend:build` pelo menos uma vez.

2. **Backend Requerido**: A maioria das funcionalidades do frontend dependem do backend estar rodando na porta 3333.

3. **CORS**: Certifique-se de que o backend está configurado para aceitar requisições do frontend (localhost:8080).

4. **JavaScript Ignorado**: A pasta `src/resources/scripts/js/` é gerada automaticamente e está no `.gitignore`. Não faça edições diretas nela.

## Desenvolvimento de Novos Recursos

1. Crie/edite arquivos TypeScript em `scripts/ts/`
2. Crie/edite arquivos HTML em `pages/`
3. Crie/edite arquivos CSS em `style/`
4. Compile os arquivos TypeScript: `npm run frontend:build`
5. Teste no navegador: http://localhost:8080

## Troubleshooting

### Erro 404 ao carregar scripts
- Verifique se você executou `npm run frontend:build`
- Confirme que os arquivos `.js` foram gerados em `scripts/js/`

### Erro de conexão com API
- Verifique se o backend está rodando na porta 3333
- Execute `npm run dev` ou `npm run dev:watch` para iniciar o backend

### Mudanças no TypeScript não aparecem
- Se estiver usando `frontend:watch`, as mudanças são automáticas
- Se não, execute `npm run frontend:build` novamente

