const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');


// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

router.post('/registerAdmin', userController.registerAdmin);
router.post('/loginAdmin', userController.loginAdmin);
router.post('/registerSubAdmin', userController.registerSubAdmin);
//router.post('/updateSubAdmin',userController.updateSubAdmin);
//router.get('/getSubAdmin',userController.getSubAdmin);
router.post('/userRequestOTP', userController.userRequestOTP);
router.post('/userVerifyOTP', userController.userVerifyOTP);
router.post('/createlanguage', userController.createlanguage);
router.post('/createUser/:userId', userController.createUser);
router.put('updateUser/:userId', userController.updateUser);
router.get('/getAllLanguages',userController.getAllLanguages);
router.put('/updateLanguageById/:id', userController.updateLanguageById);
router.delete('/deleteLanguageById/:id', userController.deleteLanguageById);
router.get('/searchByUsername', userController.searchByUsername);
// router.post('/login', userController.login);
//router.get('/profile', authenticateJWT, userController.getProfile);
//router.put('/profile', authenticateJWT, userController.updateProfile);
router.get('/getUsers', userController.getUsers);
module.exports = router;
