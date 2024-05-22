const express=require('express');
const bcrypt = require('bcryptjs');
const User=require('../models/signupmodel');
const router = express.Router();

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

//Solicitud post para crear usuarios
router.post('/', async(req,res)=>{
    const user=req.body.user;
    const email = req.body.email;
    const password=req.body.password;
    
    // Verificar si el cuerpo de la solicitud está vacío
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "El cuerpo de la solicitud está vacío. Proporcione los datos válidos, user, email y password." });
    }
  
    // Verificar que los campos sean del tipo correcto
    if (typeof user !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: "ERROR, tipo de dato incorrecto, recuerde que solo se recibe texto." });
    }
  
    // Verificar que el email tenga una estructura válida
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El formato del correo electrónico no es válido." });
    }

    // Verificar que la contraseña tenga al menos 8 caracteres y contenga al menos un caracter especial, una letra mayúscula, una letra minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Contraseña debil, la contraseña debe tener minimo 8 caracteres, una mayuscula, una minuscula y un numero." });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un usuario con este correo electrónico." });
    }

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const existingUsername = await User.findOne({ user });
    if (existingUsername) {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
    }

    try{
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      //Crear nuevo usuario
      const newUser=new User({
        user,
        email,
        password:hashedPassword,
      });

      // Guardar el usuario en la base de datos
      await newUser.save();

      // Devolver el objeto JSON del nuevo usuario como respuesta
      res.json(newUser);
    }catch(error){
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  });
    
  module.exports=router;