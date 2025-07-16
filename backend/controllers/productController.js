
const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const { category, limit = 10, page = 1, sortBy = 'rating', order = 'desc' } = req.query;
  const query = category ? { category } : {};
  const sortQuery = { [sortBy]: order === 'desc' ? -1 : 1 };

  try {
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
