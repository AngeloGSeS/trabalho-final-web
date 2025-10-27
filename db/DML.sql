INSERT INTO Administrador (usuario, senha) VALUES
('gerente.sistema', 'hash_gS001'),
('editor.conteudo', 'hash_eC002');

INSERT INTO Produto (nome, categoria, descricao, preco, imagem, cores, id_admin) VALUES
('Jogo de Cama Percal 400 Fios', 'cama, mesa e banho', 'Conjunto de lençóis e fronhas em percal egípcio, toque acetinado.', 450.99, NULL, 'Branco, Azul Marinho, Cinza Chumbo', 1),
('Toalha de Banho Gigante Algodão Pima', 'cama, mesa e banho', 'Toalha de banho com alta absorção e gramatura premium.', 95.50, NULL, 'Bege, Verde Musgo', 2),
('Cortina Blackout em Voil', 'cama, mesa e banho', 'Cortina com camada blackout e acabamento em voil, 2.80m x 2.30m.', 289.00, NULL, 'Gelo, Palha', 1);

INSERT INTO BannerRotativo (id_banner, imagens, id_admin) VALUES
(
    1,
    ARRAY[E'\\x1a2b3c4d', E'\\x5e6f7a8b', E'\\x9c0d1e2f']::BYTEA[],
    1
);