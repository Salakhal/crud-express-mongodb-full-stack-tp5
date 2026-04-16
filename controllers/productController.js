const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
  try {
    const options = {
      page: req.query.page,
      limit: req.query.limit || 12,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      category: req.query.category,
      inStock: req.query.inStock,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search
    };
    
    // Filtrer les options undefined
    Object.keys(options).forEach(key => {
      if (options[key] === undefined || options[key] === '') {
        delete options[key];
      }
    });
    
    const stats = await productService.getStats();
    const categories = await productService.getCategories();
    const result = await productService.getAllProducts(options);
    
    res.render('products/index', {
      title: 'Catalogue des produits',
      products: result.products || [],
      pagination: result.pagination || { page: 1, totalPages: 1, totalItems: 0 },
      filters: options,
      stats: stats || { total: 0, lowStock: 0, categories: [] },
      categories: categories || ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      currentCategory: options.category || 'all'
    });
  } catch (error) {
    console.error('Erreur dans getAllProducts:', error);
    // Afficher la page avec des données par défaut au lieu d'une erreur
    res.render('products/index', {
      title: 'Catalogue des produits',
      products: [],
      pagination: { page: 1, totalPages: 1, totalItems: 0 },
      filters: {},
      stats: { total: 0, lowStock: 0, categories: [] },
      categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      currentCategory: 'all',
      error: 'Impossible de charger les produits: ' + error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).render('error', {
        title: 'Produit non trouvé',
        message: 'Le produit que vous recherchez n\'existe pas.'
      });
    }
    res.render('products/details', {
      title: product.name,
      product
    });
  } catch (error) {
    console.error('Erreur dans getProductById:', error);
    const status = error.message === 'Produit non trouvé' || error.message === 'ID invalide' ? 404 : 500;
    res.status(status).render('error', {
      title: status === 404 ? 'Produit non trouvé' : 'Erreur',
      message: error.message || 'Une erreur est survenue'
    });
  }
};

exports.showCreateForm = (req, res) => {
  try {
    console.log('Affichage du formulaire de création'); // Debug
    res.render('products/create', {
      title: 'Ajouter un produit',
      categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      product: {}
    });
  } catch (error) {
    console.error('Erreur dans showCreateForm:', error);
    res.status(500).send('Erreur: ' + error.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Traitement des tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // S'assurer que quantity est un nombre
    if (req.body.quantity) {
      req.body.quantity = parseInt(req.body.quantity);
    }
    
    // S'assurer que price est un nombre
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    
    // Gérer le checkbox inStock
    req.body.inStock = req.body.inStock === 'true' || req.body.inStock === 'on';
    
    const product = await productService.createProduct(req.body);
    req.session.flashMessage = { type: 'success', text: 'Produit créé avec succès !' };
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error('Erreur dans createProduct:', error);
    res.status(400).render('products/create', {
      title: 'Ajouter un produit',
      categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      product: req.body,
      error: error.message
    });
  }
};

exports.showEditForm = async (req, res) => {
  try {
    console.log('Affichage formulaire édition pour ID:', req.params.id);
    const product = await productService.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Produit non trouvé',
        message: 'Le produit que vous voulez modifier n\'existe pas.'
      });
    }
    
    res.render('products/edit', {
      title: `Modifier ${product.name}`,
      categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      product: product,
      error: null // Initialiser error à null
    });
  } catch (error) {
    console.error('Erreur dans showEditForm:', error);
    res.status(404).render('error', {
      title: 'Produit non trouvé',
      message: error.message || 'Une erreur est survenue'
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log('Mise à jour produit ID:', req.params.id);
    console.log('Données reçues:', req.body);
    
    // Traitement des tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // S'assurer que quantity est un nombre
    if (req.body.quantity) {
      req.body.quantity = parseInt(req.body.quantity);
    }
    
    // S'assurer que price est un nombre
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    
    // Gérer le checkbox inStock
    req.body.inStock = req.body.inStock === 'true' || req.body.inStock === 'on';
    
    const product = await productService.updateProduct(req.params.id, req.body);
    req.session.flashMessage = { type: 'success', text: 'Produit mis à jour avec succès !' };
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error('Erreur dans updateProduct:', error);
    
    // Récupérer le produit original pour réafficher le formulaire
    try {
      const originalProduct = await productService.getProductById(req.params.id);
      res.status(400).render('products/edit', {
        title: 'Modifier le produit',
        categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
        product: { ...originalProduct.toObject(), ...req.body, _id: req.params.id },
        error: error.message
      });
    } catch (err) {
      res.status(400).render('products/edit', {
        title: 'Modifier le produit',
        categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
        product: { ...req.body, _id: req.params.id },
        error: error.message
      });
    }
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // Traitement des tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // S'assurer que quantity est un nombre
    if (req.body.quantity) {
      req.body.quantity = parseInt(req.body.quantity);
    }
    
    // S'assurer que price est un nombre
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    
    // Gérer le checkbox inStock
    req.body.inStock = req.body.inStock === 'true' || req.body.inStock === 'on';
    
    const product = await productService.updateProduct(req.params.id, req.body);
    req.session.flashMessage = { type: 'success', text: 'Produit mis à jour avec succès !' };
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error('Erreur dans updateProduct:', error);
    res.status(400).render('products/edit', {
      title: 'Modifier le produit',
      categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      product: { ...req.body, _id: req.params.id },
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    req.session.flashMessage = { type: 'success', text: 'Produit supprimé avec succès' };
    res.redirect('/products');
  } catch (error) {
    console.error('Erreur dans deleteProduct:', error);
    req.session.flashMessage = { type: 'error', text: error.message || 'Erreur lors de la suppression' };
    res.redirect('/products');
  }
};