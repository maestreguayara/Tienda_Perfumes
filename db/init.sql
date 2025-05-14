-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tienda_perfumes;
USE tienda_perfumes;

-- Crear tabla de perfumes
CREATE TABLE IF NOT EXISTS perfumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255)
);

-- Insertar perfumes de ejemplo
INSERT INTO perfumes (nombre, descripcion, precio, imagen_url) VALUES
('Perfume Fresco', 'Aroma cítrico y refrescante.', 49.99, 'img/fresco.jpg'),
('Perfume Dulce', 'Notas de vainilla y frutas tropicales.', 59.99, 'img/dulce.jpg'),
('Perfume Amaderado', 'Con un toque de sándalo y cedro.', 69.99, 'img/amaderado.jpg'),
('Perfume Floral', 'Esencia de flores blancas y lavanda.', 55.50, 'img/floral.jpg'),
('Perfume Intenso', 'Aroma fuerte y elegante para la noche.', 75.00, 'img/intenso.jpg');

-- Crear tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
