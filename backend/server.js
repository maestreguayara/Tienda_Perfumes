const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_perfumes'
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

app.get('/', (req, res) => {
    res.send('API Tienda de Perfumes');
});

app.get('/api/perfumes', (req, res) => {
    const sql = 'SELECT * FROM perfumes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener perfumes' });
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
