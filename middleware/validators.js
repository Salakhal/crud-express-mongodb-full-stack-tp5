const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères')
    .isLength({ max: 100 }).withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif')
    .toFloat(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères'),
  
  body('category')
    .optional()
    .isIn(['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'])
    .withMessage('Catégorie invalide'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('La quantité doit être un nombre entier positif')
    .toInt(),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('La note doit être entre 0 et 5')
    .toFloat(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      
      if (req.originalUrl.startsWith('/api')) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const isEdit = req.path.includes('update');
      const viewData = {
        title: isEdit ? 'Modifier le produit' : 'Ajouter un produit',
        categories: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
        product: req.body,
        error: errorMessages.join(', ')
      };
      
      if (isEdit) {
        viewData.product._id = req.params.id;
        return res.status(400).render('products/edit', viewData);
      }
      return res.status(400).render('products/create', viewData);
    }
    next();
  }
];

module.exports = { validateProduct };