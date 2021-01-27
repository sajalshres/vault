const mongoose = require('mongoose');

const vaultLoginSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    links: [{ type: String, required: false }],
    note: {
      type: String,
      required: true,
    },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VaultLogin', vaultLoginSchema);
