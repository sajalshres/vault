const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { listUsers, createUser, replaceUser, updateUser } = require('../../validations/user.validation');

const router = express.Router();

router.param('userID', controller.load);

router
  .route('/')
  .get(authorize(ADMIN), validate(listUsers), controller.list)
  .post(authorize(ADMIN), validate(createUser), controller.create);

router.route('/profile').get(authorize(), controller.loggedIn);

module.exports = router;
