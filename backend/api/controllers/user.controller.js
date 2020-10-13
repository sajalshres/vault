const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user.model');

/**
 * Load user and append to req
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} id
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @param {*} req
 * @param {*} res
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user details
 * @param {*} req
 * @param {*} res
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create a new user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace an existing user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const omitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', omitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update an existing user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.update = (req, res, next) => {
  const omitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, omitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((error) => next(User.checkDuplicateEmail(error)));
};

/**
 * Get user list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUser = users.map((user) => user.transform());
    res.json(transformedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((error) => next(error));
};
