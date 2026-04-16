const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif'],
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  category: {
    type: String,
    enum: {
      values: ['Électronique', 'Vêtements', 'Alimentation', 'Livres', 'Maison', 'Sports', 'Autres'],
      message: '{VALUE} n\'est pas une catégorie valide'
    },
    default: 'Autres'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    min: [0, 'La quantité ne peut pas être négative'],
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: 'https://placehold.co/400x300?text=Product+Image'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour les recherches
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

// Méthode virtuelle pour le prix formaté
productSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(this.price);
});

// Méthode d'instance
productSchema.methods.isLowStock = function() {
  return this.quantity < 5 && this.quantity > 0;
};

// Méthode statique
productSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

// Middleware pre-save
productSchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.inStock = false;
  } else if (this.quantity > 0) {
    this.inStock = true;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;