-- ==========================================
-- BASE DE DATOS: TIENDA DE ROPA
-- ==========================================

-- ==========================================
-- TABLA: CATEGORIAS
-- ==========================================

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

-- ==========================================
-- TABLA: USUARIOS
-- ==========================================

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'CLIENTE',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA: PRODUCTOS
-- ==========================================

CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    talla VARCHAR(20),
    imagen VARCHAR(255),
    id_categoria INTEGER NOT NULL,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
);

-- ==========================================
-- TABLA: PEDIDOS
-- ==========================================

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) DEFAULT 'PENDIENTE',
    total DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

-- ==========================================
-- TABLA: DETALLE DEL PEDIDO
-- ==========================================

CREATE TABLE detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido),

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
);

-- ==========================================
-- CATEGORIAS DE PRUEBA
-- ==========================================

INSERT INTO categorias (nombre, descripcion)
VALUES
('Polos', 'Polos para damas y caballeros'),
('Pantalones', 'Pantalones de diferentes estilos'),
('Casacas', 'Casacas y prendas para exteriores'),
('Vestidos', 'Vestidos para diferentes ocasiones');

-- ==========================================
-- PRODUCTOS DE PRUEBA
-- ==========================================

INSERT INTO productos
(nombre, descripcion, precio, stock, talla, imagen, id_categoria)
VALUES
(
    'Polo Oversize Negro',
    'Polo de algodón estilo oversize',
    59.90,
    20,
    'M',
    'polo-negro.jpg',
    1
),
(
    'Polo Básico Blanco',
    'Polo básico de algodón',
    39.90,
    25,
    'L',
    'polo-blanco.jpg',
    1
),
(
    'Jean Clásico Azul',
    'Jean clásico de corte recto',
    89.90,
    15,
    '32',
    'jean-azul.jpg',
    2
),
(
    'Casaca Denim',
    'Casaca de mezclilla',
    119.90,
    10,
    'M',
    'casaca-denim.jpg',
    3
),
(
    'Vestido Casual',
    'Vestido casual para dama',
    99.90,
    12,
    'M',
    'vestido-casual.jpg',
    4
);