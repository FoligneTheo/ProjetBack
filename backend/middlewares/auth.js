const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Récupère le token du header
        if (!token) {
            return res.status(401).json({ message: "Accès refusé, token manquant" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken; // Ajoute l'utilisateur à la requête
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentification échouée" });
    }
};
