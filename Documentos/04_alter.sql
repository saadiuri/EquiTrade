-- Comandos ALTER para o sistema EquiTrade

-- 1. Adicionar uma nova coluna à tabela users
ALTER TABLE users ADD data_nascimento DATE;

-- 2. Remover a coluna 'celular' da tabela users
ALTER TABLE users DROP COLUMN celular;

-- 3. Adicionar uma constraint de chave estrangeira explicitamente nomeada (caso não tenha sido nomeada antes)
ALTER TABLE cavalos ADD CONSTRAINT fk_dono FOREIGN KEY (dono) REFERENCES users(id);

-- 4. Criar índice para melhorar buscas por email
CREATE INDEX idx_email ON users(email);
