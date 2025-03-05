const Book = require('./models/books');
const AuthRoutes = require('../routes/authRoutes');
const BookRoutes = require('../routes/bookRoutes');

app.post('/api/books', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});
