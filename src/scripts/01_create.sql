-- DDL - CREATE TABLES

-- Tabela de usuários
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

-- Tabela de vendedor
CREATE TABLE vendedor (
  id CHAR(36) PRIMARY KEY,
  nota FLOAT DEFAULT 0.0,
  FOREIGN KEY (id) REFERENCES users(id)
);

-- Tabela de comprador
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

-- ALTER - Adicionando índice
CREATE INDEX idx_email ON users(email);