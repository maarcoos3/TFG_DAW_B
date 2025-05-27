const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Obtener todos los usuarios
router.get('/usuarios', (req, res) => {
  db.query('SELECT id, nombre, email FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// DELETE - Eliminar un usuario y sus reservas
router.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  // Primero eliminamos sus reservas
  db.query('DELETE FROM reservas WHERE usuario_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar reservas del usuario' });

    // Luego eliminamos al usuario
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Error al eliminar usuario' });
      res.json({ message: 'Usuario eliminado correctamente' });
    });
  });
});

module.exports = router;
