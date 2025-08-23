const e = require('express');
const db = require('../models');
const paginate = require('../helper/paginate');

exports.movieInfo = async (req, res) => {
    const { slug } = req.params;

    try {
        const movie = await db.Movie.findOne({
            where: { slug },
            include: [db.Genre, db.Country, db.Episode]
        });

        if (!movie) return res.status(404).send('Không tìm thấy phim.');

        const episodes = await db.Episode.findAll({
            where: { movie_id: movie.id },
            order: [['id', 'ASC']]
        });

        const comments = await db.Comment.findAll({
            where: { movie_id: movie.id },
            include: [db.User]
        });

        const isSaved = req.user && await db.SavedMovie.findOne({
            where: { user_id: req.user.id, movie_id: movie.id }
        });

        res.render('movie/movieInfo', {
            title: `${movie.title}`,
            movie,
            episodes,
            comments,
            user: req.user || null,
            isSaved
        });
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
}

exports.watchMovie = async (req, res) => {
    const { slug, tap } = req.params;
    const episodeName = tap ? `${tap}` : '1';

    try {
        const movie = await db.Movie.findOne({
            where: { slug },
            include: [db.Episode, db.Genre, db.Country]
        });

        if (!movie) return res.status(404).send('Không tìm thấy phim.');

        const episodes = await db.Episode.findAll({
            where: { movie_id: movie.id },
            order: [['id', 'DESC']]
        });

        const currentEpisode = episodes.find(ep => ep.episode_name == episodeName) || episodes[0];

        res.render('movie/movie', {
            title: `${movie.title} - Xem phim`,
            movie,
            currentEpisode,
            episodes
        });
    } catch (err) {
        res.status(500).send('Lỗi server');
    }
};

exports.addToFavorites = async (req, res) => {
    const movieId = parseInt(req.params.movieId, 10);

    if (!movieId) {
        return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    try {
        const userId = req.user.id;
        const user = await db.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const saved = await db.SavedMovie.findOne({
            where: { user_id: userId, movie_id: movieId }
        });
        let action;

        if (saved) {
            await saved.destroy();
            action = 'remove';
        } else {
            await db.SavedMovie.create({ user_id: userId, movie_id: movieId });
            action = 'add';
        }

        return res.json({
            success: true,
            action
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error: ' + err.message });
    }
};

exports.favorites = async (req, res) => {
    const userId = req.user.id;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 24;

        const { rows: movies, currentPage, totalPages, pages } = await paginate(db.Movie, page, limit, {
            include: [{
                model: db.SavedMovie,
                where: { user_id: userId },
                required: true
            }, {
                model: db.Episode
            }],
            order: [['updated_at', 'DESC']]
        });

        res.render('movie/favorites', {
            title: 'Phim đã lưu',
            movies,
            currentPage,
            totalPages,
            pages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
};
