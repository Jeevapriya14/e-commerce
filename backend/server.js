const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error(err));


const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  rating: Number,
  company: String,
  discount: Number,
});

const Product = mongoose.model('Product', productSchema);


app.get('/api/products', async (req, res) => {
  try {
    const {
      category = '',  
      limit = 10,
      page = 1,
      sort = 'rating', 
      order = 'desc',  
    } = req.query;

    const filter = category ? { category } : {};

    const sortOption = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post('/api/products', async (req, res) => {
  console.log('POST /api/products body:', req.body);
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(400).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
