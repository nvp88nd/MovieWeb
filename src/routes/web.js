const express = require('express');
const router = express.Router();
const { homePage } = require('../controllers/home');
const { movieInfo, watchMovie, addToFavorites, favorites } = require('../controllers/movie');
const { login, register, getLoginPage, getRegisterPage, getProfile, updateProfile, logout } = require('../controllers/auth');
const adminController = require('../controllers/admin');
const authenticateToken = require('../middlewares/authenticateToken');
const adminAuthToken = require('../middlewares/adminAuthToken');

// Home controller routes
router.get('/', homePage);

// Movie controller routes
router.get('/movie/:slug', movieInfo);
router.get('/movie/:slug/:tap', watchMovie);
router.post('/saveMovie/:movieId', authenticateToken, addToFavorites);
router.get('/favorites', authenticateToken, favorites);

// Auth controller routes
router.post('/login', login);
router.post('/register', register);
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/logout', logout);

//Admin routes
router.get('/admin/dashboard', adminAuthToken, adminController.dashboard);
router.get('/admin/movies', adminAuthToken, adminController.moviesList);

module.exports = router;
