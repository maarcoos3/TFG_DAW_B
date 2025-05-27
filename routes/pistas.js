const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Listar todas las pistas
router.get('/pistas', (req, res) => {
  db.query('SELECT * FROM pistas', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error obteniendo pistas' });
    res.json(results);
  });
});

// POST - Crear nueva pista
// router.post('/pistas', (req, res) => {
//   const { nombre } = req.body;
//   if (!nombre) return res.status(400).json({ message: 'Nombre requerido' });

//   db.query('INSERT INTO pistas (nombre, estado) VALUES (?, "libre")', [nombre], (err) => {
//     if (err) return res.status(500).json({ message: 'Error al crear pista' });

//     db.query('SELECT * FROM pistas', (err2, pistas) => {
//       if (err2) return res.status(500).json({ message: 'Error al actualizar lista' });
//       res.json(pistas);
//     });
//   });
// });
// POST - Crear nueva reserva (con validación de solapamiento)
router.post('/reservas', (req, res) => {
  const { usuario_id, pista_id, fecha, hora_inicio, hora_fin } = req.body;

  if (!usuario_id || !pista_id || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ message: 'Faltan datos para la reserva' });
  }

  // Verificar si ya existe una reserva en la misma pista, fecha y hora
  const checkSql = `
    SELECT * FROM reservas
    WHERE pista_id = ? AND fecha = ? AND hora_inicio = ? AND hora_fin = ?
  `;
  db.query(checkSql, [pista_id, fecha, hora_inicio, hora_fin], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al verificar disponibilidad', error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: 'La pista ya está reservada en ese horario' });
    }

    // Insertar la reserva si está libre
    const insertSql = `
      INSERT INTO reservas (usuario_id, pista_id, fecha, hora_inicio, hora_fin)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [usuario_id, pista_id, fecha, hora_inicio, hora_fin], (err) => {
      if (err) return res.status(500).json({ message: 'Error al guardar reserva', error: err });
      res.status(201).json({ message: 'Reserva guardada correctamente' });
    });
  });
});


// PUT - Editar pista
router.put('/pistas/:id', (req, res) => {
  const { nombre, estado } = req.body;
  const { id } = req.params;

  db.query('UPDATE pistas SET nombre = ?, estado = ? WHERE id = ?', [nombre, estado, id], (err) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar pista' });
    res.json({ message: 'Pista actualizada correctamente' });
  });
});

// DELETE - Eliminar pista
router.delete('/pistas/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM pistas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar pista' });
    res.json({ message: 'Pista eliminada correctamente' });
  });
});

module.exports = router;
