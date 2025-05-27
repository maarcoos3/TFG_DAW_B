const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - Crear nueva reserva
router.post('/reservas', (req, res) => {
  const { usuario_id, pista_id, fecha, hora_inicio, hora_fin } = req.body;

  if (!usuario_id || !pista_id || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ message: 'Faltan datos para la reserva' });
  }

  const sql = `
    INSERT INTO reservas (usuario_id, pista_id, fecha, hora_inicio, hora_fin)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [usuario_id, pista_id, fecha, hora_inicio, hora_fin], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al guardar reserva', error: err });
    res.status(201).json({ message: 'Reserva guardada correctamente' });
  });
});

// GET - Obtener reservas por usuario
router.get('/reservas/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const sql = `
    SELECT r.*, p.nombre AS nombre_pista 
    FROM reservas r 
    JOIN pistas p ON r.pista_id = p.id 
    WHERE r.usuario_id = ?
    ORDER BY r.fecha DESC, r.hora_inicio DESC
  `;
  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener reservas' });
    res.json(results);
  });
});

// PUT - Actualizar reserva
router.put('/reservas/:id', (req, res) => {
  const { fecha, hora_inicio, hora_fin } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE reservas SET fecha = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?',
    [fecha, hora_inicio, hora_fin, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Error actualizando reserva' });
      res.json({ message: 'Reserva actualizada correctamente' });
    }
  );
});

// DELETE - Eliminar reserva
router.delete('/reservas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reservas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Error eliminando reserva' });
    res.json({ message: 'Reserva eliminada correctamente' });
  });
});

// GET - Obtener todas las reservas (admin)
router.get('/reservas', (req, res) => {
  const sql = `
    SELECT r.*, p.nombre AS nombre_pista, u.nombre AS nombre_usuario
    FROM reservas r
    JOIN pistas p ON r.pista_id = p.id
    JOIN usuarios u ON r.usuario_id = u.id
    ORDER BY r.fecha DESC, r.hora_inicio DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener reservas' });
    res.json(results);
  });
});


// Obtener reservas por usuario y fecha específica
router.get('/reservas/:usuario_id/:fecha', (req, res) => {
  const { usuario_id, fecha } = req.params;

  const sql = `
    SELECT r.*, p.nombre AS nombre_pista
    FROM reservas r
    JOIN pistas p ON r.pista_id = p.id
    WHERE r.usuario_id = ? AND r.fecha = ?
    ORDER BY r.hora_inicio
  `;

  db.query(sql, [usuario_id, fecha], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener reservas del día' });
    res.json(results);
  });
});


module.exports = router;
