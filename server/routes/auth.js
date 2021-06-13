const express = require("express");
const router = express.Router();

const {register,login,forgotpassword, resetpassword} = require('../controllers/auth.js');

router.post('/register',register);
router.post('/login',login);
router.post('/forgotpassword',forgotpassword);
router.put('/resetpassword/:resettoken',resetpassword);


module.exports = router;