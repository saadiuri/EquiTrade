-- DML - INSERT
INSERT INTO users (id, nome, email, senha, celular, endereco, type, createdAt, updatedAt)
VALUES ('uuid-1', 'João Vendedor', 'joao@exemplo.com', 'senha123', '11999999999', 'Rua A, 123', 'vendedor', NOW(), NOW()),
       ('uuid-2', 'Maria Compradora', 'maria@exemplo.com', 'senha456', '11988888888', 'Rua B, 456', 'comprador', NOW(), NOW());

INSERT INTO vendedor (id, nota) VALUES ('uuid-1', 4.5);
INSERT INTO comprador (id) VALUES ('uuid-2');

INSERT INTO cavalos (id, nome, idade, raca, preco, descricao, disponivel, createdAt, updatedAt, dono)
VALUES ('uuid-3', 'Trovão', 5, 'Mangalarga', 15000.00, 'Cavalo premiado', TRUE, NOW(), NOW(), 'uuid-1');

INSERT INTO anuncios (id, titulo, descricao, preco, ativo, createdAt, updatedAt, vendedorId, cavaloId)
VALUES ('uuid-4', 'Venda de Trovão', 'Cavalo saudável e premiado', 15000.00, TRUE, NOW(), NOW(), 'uuid-1', 'uuid-3');

INSERT INTO mensagens (id, conteudo, createAt, remetente_id, destinatario_id)
VALUES ('uuid-5', 'Olá, tenho interesse no cavalo!', NOW(), 'uuid-2', 'uuid-1');

-- DML - UPDATE
UPDATE cavalos SET preco = 14000.00 WHERE id = 'uuid-3';
UPDATE anuncios SET ativo = FALSE WHERE id = 'uuid-4';
UPDATE users SET celular = '11999998888' WHERE id = 'uuid-2';

-- DML - DELETE
DELETE FROM mensagens WHERE id = 'uuid-5';
DELETE FROM anuncios WHERE id = 'uuid-4';
DELETE FROM cavalos WHERE id = 'uuid-3';

-- SELECTs úteis
SELECT * FROM users;
SELECT * FROM cavalos WHERE disponivel = TRUE;
SELECT * FROM anuncios WHERE ativo = TRUE;
SELECT nome, raca, preco FROM cavalos WHERE raca = 'Mangalarga';
