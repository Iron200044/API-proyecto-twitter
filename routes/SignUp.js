const express=require('express')
const router = express.Router();

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

//Solicitud post para crear usuarios
router.post('/',(req,res)=>{
    const user=req.body.user;
    const email = req.body.email;
    const password=req.body.password;
  
    // Verificar si el cuerpo de la solicitud está vacío
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("El cuerpo de la solicitud está vacío. Proporcione los datos válidos, user, Email y password.");
    }
  
    // Verificar que los campos sean del tipo correcto
    if (typeof user !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).send("ERROR, tipo de dato incorrecto, recuerde que solo se recive texto.");
    }
  
    // Verificar que el email tenga una estructura válida
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("El formato del correo electrónico no es válido.");
    }
  
    //Crear nuevo usuario
    const newUser={
      USER: user,
      Email: email,
      PASSWORD: password
    };
    // Devolver el objeto JSON del nuevo usuario como respuesta
    res.json(newUser);
  })
    
  module.exports=router;