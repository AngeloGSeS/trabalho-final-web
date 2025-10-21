CREATE TABLE Administrador (
    id_admin SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(50) NOT NULL
);

CREATE TABLE Produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    imagem BYTEA,
    cores VARCHAR(255),
    id_admin INT NOT NULL,

    CONSTRAINT fk_admin_produto
        FOREIGN KEY (id_admin)
        REFERENCES Administrador (id_admin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE BannerRotativo (
    id_banner INT PRIMARY KEY,
    imagens BYTEA[] NOT NULL,
    id_admin INT NOT NULL,

    CONSTRAINT fk_admin_banner
        FOREIGN KEY (id_admin)
        REFERENCES Administrador (id_admin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);