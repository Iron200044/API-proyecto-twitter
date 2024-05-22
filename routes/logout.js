const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

// Ruta para cerrar sesión
router.post('/',authenticateJWT, (req, res) => {
    // Elimina la cookie que contiene el token
    res.clearCookie('token');
    res.status(200).json({message:'Cierre de sesión exitoso.'});
});

module.exports = router;