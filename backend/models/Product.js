
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  rating: Number,
  company: String,
  discount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
