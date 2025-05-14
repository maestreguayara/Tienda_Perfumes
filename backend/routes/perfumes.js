const express = require('express');
const router = express.Router();
const conexion = require('../db/conexion');

// Ruta para obtener todos los perfumes
router.get('/perfumes', (req, res) => {
    const query = 'SELECT * FROM perfumes';
    conexion.query(query, (err, resultados) => {
        if (err) {
            console.error('Error al consultar perfumes:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(resultados);
        }
    });
});

// Ruta para recibir mensajes de contacto
router.post('/contacto', (req, res) => {
    const { nombre, email, mensaje } = req.body;
    const query = 'INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES (?, ?, ?)';
    
    conexion.query(query, [nombre, email, mensaje], (err, resultados) => {
        if (err) {
            console.error('Error al insertar mensaje de contacto:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.status(200).send('Mensaje enviado con éxito');
        }
    });
});

module.exports = router;
