const e = require('express');
const db = require('../models');
const paginate = require('../helper/paginate');
const { or } = require('sequelize');
const dayjs = require('../utils/dayjs');

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

        const isSaved = req.user && await db.SavedMovie.findOne({
            where: { user_id: req.user.id, movie_id: movie.id }
        });

        res.render('movie/movieInfo', {
            title: `${movie.title}`,
            movie,
            episodes,
            user: req.user || null,
            isSaved: isSaved ? true : false
        });
    } catch (err) {
        res.status(500).render('error', { title: err.message || 'Lỗi khi tải trang phim' });
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
        req.flash('error_msg', err.message || 'Lỗi khi tải trang xem phim');
        res.redirect('/');
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
        req.flash('error_msg', err.message || 'Lỗi khi tải trang phim đã lưu');
        res.redirect('/');
    }
};

exports.postComment = async (req, res) => {
    const { movie_id, content } = req.body;

    if (!movie_id || !content) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    try {
        const comment = await db.Comment.create({
            user_id: req.user.id,
            movie_id,
            content
        });

        return res.status(201).json({
            success: true,
            comment: {
                id: comment.id,
                content: comment.content,
                created_at: comment.created_at,
                user: {
                    id: req.user.id,
                    username: req.user.username
                }
            }

        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || 'Lỗi khi gửi bình luận' });
    }
};

exports.getComments = async (req, res) => {
    const movieId = req.query.movie_id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    try {
        const { rows: comments } = await paginate(db.Comment, page, limit, {
            where: { movie_id: movieId },
            include: [{
                model: db.User,
                attributes: ['id', 'username']
            }],
            order: [['created_at', 'DESC']]
        });
        const formattedComments = comments.map(c => {
            const plain = c.toJSON();
            return {
                ...plain,
                timeAgo: dayjs(plain.created_at).fromNow()
            };
        });
        const commentsCount = await db.Comment.count({ where: { movie_id: movieId } });

        return res.json({
            success: true,
            comments: formattedComments,
            totalComments: commentsCount
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || 'Lỗi khi tải bình luận' });
    }
};
