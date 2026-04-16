const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validators');

// Routes spécifiques d'abord
router.get('/create', productController.showCreateForm);
router.post('/create', validateProduct, productController.createProduct);

// Routes avec paramètres
router.get('/edit/:id', productController.showEditForm);
router.post('/:id/update', validateProduct, productController.updateProduct);
router.post('/:id/delete', productController.deleteProduct);

// Route dynamique (doit être après les routes spécifiques)
router.get('/:id', productController.getProductById);

// Route principale (doit être en dernier)
router.get('/', productController.getAllProducts);

module.exports = router;