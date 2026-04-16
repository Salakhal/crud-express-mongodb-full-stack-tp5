const Product = require('../models/product');

class ProductService {
  async createProduct(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new Error(`Validation: ${messages.join(', ')}`);
      }
      throw error;
    }
  }

  async getAllProducts(options = {}) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (options.category && options.category !== 'all') filter.category = options.category;
    if (options.inStock === 'true') filter.inStock = true;
    if (options.minPrice || options.maxPrice) {
      filter.price = {};
      if (options.minPrice) filter.price.$gte = parseFloat(options.minPrice);
      if (options.maxPrice) filter.price.$lte = parseFloat(options.maxPrice);
    }
    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } }
      ];
    }

    const sort = {};
    if (options.sortBy) {
      sort[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    try {
      const [products, total] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit),
        Product.countDocuments(filter)
      ]);

      return {
        products,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) throw new Error('Produit non trouvé');
      return product;
    } catch (error) {
      if (error.name === 'CastError') throw new Error('ID invalide');
      throw error;
    }
  }

  async updateProduct(id, data) {
    try {
      const product = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
      });
      if (!product) throw new Error('Produit non trouvé');
      return product;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message);
        throw new Error(`Validation: ${messages.join(', ')}`);
      }
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) throw new Error('Produit non trouvé');
      return { success: true, message: 'Produit supprimé' };
    } catch (error) {
      throw error;
    }
  }

  async getCategories() {
    const categories = await Product.distinct('category');
    return categories;
  }

  async getStats() {
    const [total, lowStock, categories] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ quantity: { $lt: 5 }, quantity: { $gt: 0 } }),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);
    return { total, lowStock, categories };
  }
}

module.exports = new ProductService();