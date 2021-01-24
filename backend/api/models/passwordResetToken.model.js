const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

const passwordResetTokenSchema = new mongoose.Schema({
  resetToken: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    ref: 'User',
    required: true,
  },
  expires: {
    type: Date,
  },
});

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

passwordResetTokenSchema.statics = {
  async generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const resetToken = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(2, 'hours').toDate();
    const ResetTokenObject = new PasswordResetToken({
      resetToken,
      userId,
      userEmail,
      expires,
    });
    await ResetTokenObject.save();
    return ResetTokenObject;
  },
};

module.exports = PasswordResetToken;
