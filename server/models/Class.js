const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true, enum: ['NC', 'ND', 'HND'] },
  modules: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Add compound unique index for name + level combination
classSchema.index({ name: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);