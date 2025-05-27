// Backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


//Pista Routes
const pistaRoutes = require('./routes/pistas');
app.use('/api', pistaRoutes);

// Reserva Routes
const reservasRoutes = require('./routes/reservas');
app.use('/api', reservasRoutes);

//Usuarios Routes
const usuariosRoutes = require('./routes/usuarios');
app.use('/api', require('./routes/usuarios'));

const contactoRoutes = require('./routes/contacto');
app.use('/api', require('./routes/contacto'));




