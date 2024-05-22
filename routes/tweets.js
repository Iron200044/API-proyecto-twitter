const express=require('express')
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const Tweet = require('../models/tweetmodel');

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

// Ruta para crear un tweet
router.post('/', authenticateJWT, async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).send('El contenido del tweet es requerido.');
    }

    try {
        const tweet = new Tweet({
            content,
            user: req.user.id // Usar el ID del usuario autenticado
        });

        await tweet.save();
        res.status(201).json(tweet);
    } catch (error) {
        res.status(500).send('Error al crear el tweet');
    }
});

// Ruta para editar un tweet
router.put('/edit/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).send('El contenido del tweet es requerido.');
    }

    try {
        const tweet = await Tweet.findById(id);
        
        if (!tweet) {
            return res.status(404).send('Tweet no encontrado.');
        }

        // Verificar si el usuario autenticado es el dueño del tweet
        if (tweet.user.toString() !== req.user.id) {
            return res.status(403).send('No autorizado para editar este tweet.');
        }

        tweet.content = content;
        await tweet.save();

        res.status(200).json(tweet);
    } catch (error) {
        res.status(500).send('Error al editar el tweet');
    }
});

// Ruta para eliminar un tweet
router.delete('/delete/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        console.log('ID del tweet:', id);
        const tweet = await Tweet.findById(id);

        if (!tweet) {
            return res.status(404).send('Tweet no encontrado.');
        }

        console.log('Tweet encontrado:', tweet);
        console.log('ID del usuario del tweet:', tweet.user.toString());
        console.log('ID del usuario autenticado:', req.user.id);

        // Verificar si el usuario autenticado es el dueño del tweet
        if (tweet.user.toString() !== req.user.id) {
            return res.status(403).send('No autorizado para eliminar este tweet.');
        }

        await Tweet.findByIdAndDelete(id);

        res.status(200).send('Tweet eliminado.');
    } catch (error) {
        console.error('Error al eliminar el tweet:', error);
        res.status(500).send('Error al eliminar el tweet');
    }
});

//Ruta de busqueda de tweets
router.get('/search',authenticateJWT, async (req,res) => {
    const {query}=req.query;
    console.log('Query recibido:', query); // Agrega esto para depuración
    if (!query) {
        return res.status(400).send('Query parameter is required.');
    }

    try {
        const tweets = await Tweet.find({
            content: { $regex: query, $options: 'i' }
        });

        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).send('Error al buscar tweets');
    }
});

// Ruta para dar like a un tweet
router.post('/like/:id', authenticateJWT, async (req, res) => {
    const tweetId = req.params.id;
    const userId = req.user.id;
  
    try {
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return res.status(404).send('Tweet no encontrado.');
      }
  
      // Verificar si el usuario ya ha dado like
      if (tweet.likes.includes(userId)) {
        return res.status(400).send('Ya has dado like a este tweet.');
      }
  
      tweet.likes.push(userId);
      await tweet.save();
  
      res.status(200).json(tweet);
    } catch (error) {
      res.status(500).send('Error al dar like al tweet');
    }
  });

  // Ruta para quitar like a un tweet
router.post('/unlike/:id', authenticateJWT, async (req, res) => {
    const tweetId = req.params.id;
    const userId = req.user.id;
  
    try {
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return res.status(404).send('Tweet no encontrado.');
      }
  
      // Verificar si el usuario no ha dado like
      if (!tweet.likes.includes(userId)) {
        return res.status(400).send('No has dado like a este tweet.');
      }
  
      tweet.likes = tweet.likes.filter(id => id.toString() !== userId);
      await tweet.save();
  
      res.status(200).json(tweet);
    } catch (error) {
      res.status(500).send('Error al quitar like al tweet');
    }
  });
  
module.exports = router;