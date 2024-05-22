const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/signupmodel'); // Asegúrate de tener este modelo
const router = express.Router();

const SECRET_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNTg2MTcwOSwiaWF0IjoxNzE1ODYxNzA5fQ.x60H7eRK0D6ZvfSgFl8rSTF_3c5gYj_h5kHSPCDIFuo';

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

// Solicitud POST para el login de usuarios
router.post('/', async (req, res) => {
  const { identifier, password } = req.body;

  // Verificar si el cuerpo de la solicitud está vacío
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send("El cuerpo de la solicitud está vacío. Proporcione los datos válidos, usuario y contraseña.");
  }

  // Verificar que los campos sean del tipo correcto
  if (typeof identifier !== 'string' || typeof password !== 'string') {
    return res.status(400).send("ERROR, tipo de dato incorrecto, recuerde que solo se recibe texto.");
  }

  try {
    // Buscar el usuario en la base de datos por email
    const user = await User.findOne({ 
      $or: [
        { email: identifier },
        { user: identifier }
    ] });

    if (!user) {
      return res.status(400).send("El usuario no existe.");
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('¿La contraseña coincide?', isMatch);
    if (!isMatch) {
      return res.status(400).send("Contraseña incorrecta.");
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log('Token generado:', token);

    // Devolver el token JWT
    res.json({ token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).send('Error en el inicio de sesión');
  }
});

module.exports = router;
