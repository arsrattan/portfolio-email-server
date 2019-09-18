let { Router } = require('express');
let postEmail = require('../controllers/emailController');

const router = Router();

router.post('/', postEmail);

module.exports = router;