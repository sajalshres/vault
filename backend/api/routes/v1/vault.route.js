const express = require('express');

const router = express.Router();

router.route('/items').get((req, res) => res.send('Vault Items'));

router.route('/logins').get((req, res) => res.send('Vault Logins'));

router.route('/notes').get((req, res) => res.send('Vault Notes'));
