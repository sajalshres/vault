const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

/**
 * Refresh Token Schema
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
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
    type: 'String',
    ref: 'User',
    required: true,
  },
  expires: { type: Date },
});

/**
 * RefreshToken model
 *
 * @typedef RefreshToken
 */
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

refreshTokenSchema.statics = {
  /**
   * Generate a refresh token and save into database
   *
   * @param {User} user
   * @returns {RefreshToken}
   */
  generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const tokenObject = new RefreshToken({
      token,
      userId,
      userEmail,
      expires,
    });
    tokenObject.save();
    return tokenObject;
  },
};

module.exports = RefreshToken;
