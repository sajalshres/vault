const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: true,
    },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VaultItem', vaultItemSchema);
