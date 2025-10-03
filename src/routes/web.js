const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const movieController = require('../controllers/movie');
const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');
const genreController = require('../controllers/genre');
const countryController = require('../controllers/country');

const authenticateToken = require('../middlewares/authenticateToken');
const adminAuthToken = require('../middlewares/adminAuthToken');

// Home controller routes
router.get('/', homeController.homePage);
router.get('/search', homeController.searchMovies);
router.get('/movies', homeController.filterMovies);

// Movie controller routes
router.get('/movie/:slug', movieController.movieInfo);
router.get('/movie/:slug/:tap', movieController.watchMovie);
router.post('/saveMovie/:movieId', authenticateToken, movieController.addToFavorites);
router.get('/favorites', authenticateToken, movieController.favorites);
router.post('/comments', authenticateToken, movieController.postComment);
router.get('/comments', movieController.getComments);

// Auth controller routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/profile', authenticateToken, authController.updateProfile);
router.get('/logout', authController.logout);
router.get('/changePassword', authenticateToken, authController.getChangePasswordPage);
router.post('/changePassword', authenticateToken, authController.changePassword);

// Genre routes
router.get('/admin/genres', adminAuthToken, genreController.genresList);
router.get('/admin/genre/add', adminAuthToken, genreController.getAddGenrePage);
router.post('/admin/genre/add', adminAuthToken, genreController.addGenre);
router.get('/admin/genre/edit/:id', adminAuthToken, genreController.getEditGenrePage);
router.post('/admin/genre/edit/:id', adminAuthToken, genreController.editGenre);
router.post('/admin/genre/delete/:id', adminAuthToken, genreController.deleteGenre);

// Country routes
router.get('/admin/countries', adminAuthToken, countryController.countriesList);
router.get('/admin/country/add', adminAuthToken, countryController.getAddCountryPage);
router.post('/admin/country/add', adminAuthToken, countryController.addCountry);
router.get('/admin/country/edit/:id', adminAuthToken, countryController.getEditCountryPage);
router.post('/admin/country/edit/:id', adminAuthToken, countryController.editCountry);
router.post('/admin/country/delete/:id', adminAuthToken, countryController.deleteCountry);

//Admin routes
router.get('/admin/dashboard', adminAuthToken, adminController.dashboard);
router.get('/admin/movies', adminAuthToken, adminController.moviesList);

// Admin -> Movie
router.get('/admin/movie/view/:id', adminAuthToken, adminController.viewMovie);
router.get('/admin/movie/add', adminAuthToken, adminController.getAddMoviePage);
router.get('/admin/movie/edit/:id', adminAuthToken, adminController.getEditMoviePage);
router.post('/admin/movie/edit/:id', adminAuthToken, adminController.editMovie);
router.post('/admin/movie/delete/:id', adminAuthToken, adminController.deleteMovie);
router.post('/admin/movie/leech/:slug', adminAuthToken, adminController.addMovie);
router.post('/admin/movie/updateall', adminAuthToken, adminController.updateAllMovie);

// Admin -> Episode
router.get('/admin/:id/episode', adminAuthToken, adminController.episodesList);
router.post('/admin/:id/episode/sync', adminAuthToken, adminController.leechEpisodes);
router.get('/admin/:slug/episodes', adminAuthToken, adminController.episodesList2);

// Admin -> User
router.get('/admin/users', adminAuthToken, adminController.usersList);
router.get('/admin/user/edit/:id', adminAuthToken, adminController.getEditUserPage);
router.post('/admin/user/edit/:id', adminAuthToken, adminController.editUser);
router.post('/admin/user/delete/:id', adminAuthToken, adminController.deleteUser);

module.exports = router;
