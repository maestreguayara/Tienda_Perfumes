const mysql = require('mysql2');

// Crear la conexión con la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Cambia esto si tu usuario es diferente
    password: '',          // Coloca tu contraseña de MySQL si tienes una
    database: 'tienda_perfumes'
});

// Probar la conexión
conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos MySQL establecida con éxito.');
    }
});

module.exports = conexion;
