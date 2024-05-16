const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/signupmodel'); // Asegúrate de tener este modelo
const router = express.Router();

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

// Solicitud POST para el login de usuarios
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el cuerpo de la solicitud está vacío
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send("El cuerpo de la solicitud está vacío. Proporcione los datos válidos, email y password.");
  }

  // Verificar que los campos sean del tipo correcto
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).send("ERROR, tipo de dato incorrecto, recuerde que solo se recibe texto.");
  }

  try {
    // Buscar el usuario en la base de datos por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("El usuario no existe.");
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Contraseña incorrecta.");
    }

    // Devolver el usuario autenticado como respuesta
    res.json(user);
  } catch (error) {
    res.status(500).send('Error en el inicio de sesión');
  }
});

module.exports = router;
