-- Tabela principal de usuários (herança para vendedor e comprador)
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  celular VARCHAR(20),
  endereco TEXT,
  type VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Tabela de vendedor (herda de users)
CREATE TABLE vendedor (
  id CHAR(36) PRIMARY KEY,
  nota FLOAT DEFAULT 0.0,
  FOREIGN KEY (id) REFERENCES users(id)
);

-- Tabela de comprador (herda de users)
CREATE TABLE comprador (
  id CHAR(36) PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES users(id)
);

-- Tabela de cavalos
CREATE TABLE cavalos (
  id CHAR(36) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INT NOT NULL,
  raca VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  disponivel BOOLEAN DEFAULT TRUE,
  premios TEXT,
  foto VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  dono CHAR(36) NOT NULL,
  FOREIGN KEY (dono) REFERENCES users(id)
);

-- Tabela de anúncios
CREATE TABLE anuncios (
  id CHAR(36) PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  vendedorId CHAR(36) NOT NULL,
  cavaloId CHAR(36) NOT NULL,
  FOREIGN KEY (vendedorId) REFERENCES users(id),
  FOREIGN KEY (cavaloId) REFERENCES cavalos(id)
);

-- Tabela de mensagens
CREATE TABLE mensagens (
  id CHAR(36) PRIMARY KEY,
  conteudo TEXT NOT NULL,
  createAt DATETIME NOT NULL,
  remetente_id CHAR(36) NOT NULL,
  destinatario_id CHAR(36) NOT NULL,
  FOREIGN KEY (remetente_id) REFERENCES users(id),
  FOREIGN KEY (destinatario_id) REFERENCES users(id)
);

-- Exemplos de INSERT para cada tabela

-- Usuários
INSERT INTO users (id, nome, email, senha, celular, endereco, type, createdAt, updatedAt)
VALUES ('uuid-1', 'João Vendedor', 'joao@exemplo.com', 'senha123', '11999999999', 'Rua A, 123', 'vendedor', NOW(), NOW()),
       ('uuid-2', 'Maria Compradora', 'maria@exemplo.com', 'senha456', '11988888888', 'Rua B, 456', 'comprador', NOW(), NOW());

-- Vendedor
INSERT INTO vendedor (id, nota) VALUES ('uuid-1', 4.5);

-- Comprador
INSERT INTO comprador (id) VALUES ('uuid-2');

-- Cavalos
INSERT INTO cavalos (id, nome, idade, raca, preco, descricao, disponivel, createdAt, updatedAt, dono)
VALUES ('uuid-3', 'Trovão', 5, 'Mangalarga', 15000.00, 'Cavalo premiado', TRUE, NOW(), NOW(), 'uuid-1');

-- Anúncios
INSERT INTO anuncios (id, titulo, descricao, preco, ativo, createdAt, updatedAt, vendedorId, cavaloId)
VALUES ('uuid-4', 'Venda de Trovão', 'Cavalo saudável e premiado', 15000.00, TRUE, NOW(), NOW(), 'uuid-1', 'uuid-3');

-- Mensagens
INSERT INTO mensagens (id, conteudo, createAt, remetente_id, destinatario_id)
VALUES ('uuid-5', 'Olá, tenho interesse no cavalo!', NOW(), 'uuid-2', 'uuid-1');

-- Exemplos de INSERT para cada tabela

-- Usuários
INSERT INTO users (id, nome, email, senha, celular, endereco, type, createdAt, updatedAt)
VALUES ('uuid-1', 'João Vendedor', 'joao@exemplo.com', 'senha123', '11999999999', 'Rua A, 123', 'vendedor', NOW(), NOW()),
       ('uuid-2', 'Maria Compradora', 'maria@exemplo.com', 'senha456', '11988888888', 'Rua B, 456', 'comprador', NOW(), NOW());

-- Vendedor
INSERT INTO vendedor (id, nota) VALUES ('uuid-1', 4.5);

-- Comprador
INSERT INTO comprador (id) VALUES ('uuid-2');

-- Cavalos
INSERT INTO cavalos (id, nome, idade, raca, preco, descricao, disponivel, createdAt, updatedAt, dono)
VALUES ('uuid-3', 'Trovão', 5, 'Mangalarga', 15000.00, 'Cavalo premiado', TRUE, NOW(), NOW(), 'uuid-1');

-- Anúncios
INSERT INTO anuncios (id, titulo, descricao, preco, ativo, createdAt, updatedAt, vendedorId, cavaloId)
VALUES ('uuid-4', 'Venda de Trovão', 'Cavalo saudável e premiado', 15000.00, TRUE, NOW(), NOW(), 'uuid-1', 'uuid-3');

-- Mensagens
INSERT INTO mensagens (id, conteudo, createAt, remetente_id, destinatario_id)
VALUES ('uuid-5', 'Olá, tenho interesse no cavalo!', NOW(), 'uuid-2', 'uuid-1');

-- DROP - Remoção de tabelas (em ordem segura)

DROP TABLE IF EXISTS mensagens;
DROP TABLE IF EXISTS anuncios;
DROP TABLE IF EXISTS cavalos;
DROP TABLE IF EXISTS comprador;
DROP TABLE IF EXISTS vendedor;
DROP TABLE IF EXISTS users;
