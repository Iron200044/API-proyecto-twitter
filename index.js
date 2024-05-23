const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
const connectDB= require('./config/databse')
const cookieParser = require('cookie-parser');
const authenticateJWT=require('./middleware/auth');

// Conectar a la base de datos
connectDB();

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(cookieParser());

// Configurar CORS
//const allowedOrigins = [
  //"http://localhost:5173/",
  //"https://fp-daw-frontend.vercel.app/"
//];
  app.use(
    cors({
      origin: '*',
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS method
      credentials: true, // If you're using cookies or sessions
    })
  );

//Rutas
const LogInRoute=require('./routes/login');
const SignUpRoute=require('./routes/SignUp');

//Rutas protegidas
const TweetRoute=require('./routes/tweets');
const LogOutRoute = require('./routes/logout');
const HomeRoute=require('./routes/home');
const { connect } = require('mongoose');

//Rutas sin proteger
app.use('/SignUp',SignUpRoute);
app.use('/login',LogInRoute);

//Rutas protegidas
app.use('/tweet',authenticateJWT,TweetRoute);
app.use('/logout',authenticateJWT, LogOutRoute);
app.use('/home',authenticateJWT,HomeRoute);

//Get default
app.get('/', (req, res) => {
    res.json({ message: 'Pagina de inicio' });
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
