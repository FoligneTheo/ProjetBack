const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config();
const app = express();

// ✅ Middleware CORS (À mettre AVANT les routes)
app.use(cors({
    origin: 'http://localhost:3000', // Autoriser le frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Autoriser les méthodes HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // Autoriser ces headers
    credentials: true // Autoriser l'envoi des cookies/tokens
}));

// ✅ Middleware manuel pour gérer les requêtes OPTIONS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Répondre OK pour les requêtes préflight
    }
    next();
});

// ✅ Middleware pour parser le JSON
app.use(express.json());

// ✅ Déclaration des routes (à mettre APRÈS CORS)
app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connexion à MongoDB réussie !'))
    .catch(err => console.log('❌ Connexion à MongoDB échouée !', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
