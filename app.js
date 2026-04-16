const express = require('express');
const path = require('path');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
require('dotenv').config();

require('./db/mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.flashMessage = req.session.flashMessage;
  delete req.session.flashMessage;
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// Routes - IMPORTANT: L'ordre des routes compte !
const productRoutes = require('./routes/productRoutes');
const apiRoutes = require('./routes/api/productRoutes');

// Route racine
app.get('/', (req, res) => {
  res.redirect('/products');
});

// Routes API (avant les routes dynamiques)
app.use('/api/products', apiRoutes);

// Routes produits
app.use('/products', productRoutes);

// 404 handler - DOIT être après toutes les routes
app.use((req, res) => {
  console.log('404 - Route non trouvée:', req.method, req.url);
  res.status(404).render('error', {
    title: 'Page non trouvée',
    message: `La page "${req.url}" n'existe pas.`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).render('error', {
    title: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue sur le serveur'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📋 Catalogue: http://localhost:${PORT}/products`);
  console.log(`➕ Ajouter: http://localhost:${PORT}/products/create`);
});