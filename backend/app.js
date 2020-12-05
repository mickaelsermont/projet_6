const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://william:william123@cluster0-k7urj.mongodb.net/test?retryWrites=true&w=majority',
<<<<<<< HEAD
<<<<<<< HEAD
  { useCreateIndex: true,
    useNewUrlParser: true,
=======
  { useNewUrlParser: true,
>>>>>>> 37be648c46e09101cfd9b3eedf55713259113429
=======
  { useNewUrlParser: true,
>>>>>>> 37be648c46e09101cfd9b3eedf55713259113429
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;