const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  class: { type: String, required: true }, // e.g., "NC Computer Systems"
  module: { type: String, required: true }, // e.g., "Computer Architecture"
  level: { 
    type: String, 
    required: true,
    enum: ['NC', 'ND', 'HND']
  },
  publicationYear: { type: Number },
  publisher: { type: String },
  edition: { type: String },
  description: { type: String },
  fileUrl: { type: String }, // Firebase storage URL
  fileName: { type: String },
  fileType: { type: String },
  available: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);