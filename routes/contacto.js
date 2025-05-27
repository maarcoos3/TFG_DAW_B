const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/contacto', (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;
  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO contacto (nombre, email, asunto, mensaje, fecha_envio)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [nombre, email, asunto, mensaje], (err) => {
    if (err) return res.status(500).json({ message: 'Error al guardar el mensaje' });
    res.status(201).json({ message: 'Mensaje guardado correctamente' });
  });
});

// Obtener todos los mensajes de contacto
router.get('/contacto', (req, res) => {
  db.query('SELECT * FROM contacto ORDER BY fecha_envio DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener mensajes' });
    res.json(results);
  });
});


// Eliminar un mensaje de contacto por ID
router.delete('/contacto/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM contacto WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar mensaje' });
    res.json({ message: 'Mensaje eliminado correctamente' });
  });
});


module.exports = router;
