const express=require('express')
const authenticateJWT = require('../middleware/auth');
const Tweet = require('../models/tweetmodel');
const router = express.Router();

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

router.get('/',authenticateJWT, async (req,res)=>{
    try {
        const tweets = await Tweet.find().populate('user');
        res.json(tweets);
      } catch (error) {
        res.status(500).send('Error al obtener los tweets');
      }
});

module.exports = router;