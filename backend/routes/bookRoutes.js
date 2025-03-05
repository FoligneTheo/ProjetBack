const express = require('express');
const multer = require('multer');
const Book = require('../models/books');
const auth = require('../middlewares/auth');

const router = express.Router();

// ✅ Configurer Multer pour stocker les images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 📁 Stocker les images ici
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Renommer le fichier
    }
});
const upload = multer({ storage: storage });

// ✅ Assurer que le backend accepte le JSON après multer
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// ✅ Route pour ajouter un livre
router.post("/books", auth, upload.single("image"), async (req, res) => {
    console.log("📸 Fichier reçu :", req.file);
    console.log("📚 Données reçues :", req.body.book);

    if (!req.file) {
        return res.status(400).json({ message: "Aucune image reçue" });
    }

    try {
        const bookData = JSON.parse(req.body.book); // ✅ Parser les données JSON envoyées

        const book = new Book({
            title: bookData.title,
            author: bookData.author,
            year: bookData.year,
            genre: bookData.genre,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
            userId: req.auth.userId,
            ratings: bookData.ratings || [],
            averageRating: bookData.averageRating || 0,
        });

        await book.save();
        res.status(201).json({ message: "Livre ajouté avec succès !", book });
    } catch (error) {
        console.error("❌ Erreur JSON lors de l'ajout du livre :", error);
        res.status(500).json({ error });
    }
});

module.exports = router;



// userId: '67b62637922bffb62dc0e6f4',
// title: 'dyth',
// author: 'dtgrhuy',
// year: 'dyj',
// genre: 'dyj',
// ratings: [ { userId: '67b62637922bffb62dc0e6f4', grade: 0 } ],
// averageRating: 0