const express = require('express');
const PORT = 3000;
const app = express();
const connectDB= require('./config/databse')

// Conectar a la base de datos
connectDB();

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

//Rutas
//const HomeRoute=require('./routes/home');
const LogInRoute=require('./routes/login');
const SignUpRoute=require('./routes/SignUp');
const { connect } = require('mongoose');

app.use('/SignUp',SignUpRoute);
app.use('/login',LogInRoute);

//Get default
app.get('/', (req, res) => {
    res.send('Home');
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
