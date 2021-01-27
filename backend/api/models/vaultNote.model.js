const mongoose = require('mongoose');

const vaultNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('VaultNote', vaultNoteSchema);
