const e = require('express');
const db = require('../models');

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
        const offset = (page - 1) * limit;

        const { count, rows: movies } = await db.Movie.findAndCountAll({
            include: [{
                model: db.SavedMovie,
                where: { user_id: userId },
                required: true
            }],
            order: [['updated_at', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        for (const movie of movies) {
            movie.Episodes = await db.Episode.findAll({
                where: { movie_id: movie.id },
                order: [['episode_name', 'DESC']]
            });
        }

        const totalPages = Math.ceil(count / limit);

        function getPageNumbers(current, total) {
            const pages = [];
            if (total <= 5) {
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                if (current > 3) pages.push('...');
                const start = Math.max(2, current - 1);
                const end = Math.min(total - 1, current + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (current < total - 2) pages.push('...');
                pages.push(total);
            }
            return pages;
        }

        const pages = getPageNumbers(page, totalPages);

        res.render('movie/favorites', {
            title: 'Danh sách phim yêu thích',
            movies,
            currentPage: page,
            totalPages,
            pages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
};
