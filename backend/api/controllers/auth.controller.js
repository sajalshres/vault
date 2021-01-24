const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { jwtExpirationInterval } = require('../../config/variables');
const APIError = require('../utils/apiError');
const PasswordResetToken = require('../models/passwordResetToken.model');
const emailProvider = require('../services/emails/emailProvider');

/**
 * Generates a object with tokens
 * @param {User} user
 * @param {AccessToken} accessToken
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');

  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Register amd return jwt token if successful
 */
exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role');
    const user = await new User(userData).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());

    res.status(httpStatus.CREATED);
    return res.json({
      token,
      user: userTransformed,
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Validates credentials and returns jwt token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();

    return res.json({
      token,
      user: userTransformed,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a fresh jwt token for a valid refresh token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Send password reset
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Reset password for a valid user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }

    const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);
    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};
