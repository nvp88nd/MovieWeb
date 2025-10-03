const db = require('../models');
const renderAdmin = require('../helper/renderAdmin');
const render = require('../helper/paginateAndRender');
const e = require('connect-flash');
const movieService = require('../services/movie');
const episodeService = require('../services/episode');
const slugify = require('../helper/slugify');
const axios = require('axios');
const { response } = require('express');
const { where } = require('sequelize');

exports.dashboard = async (req, res) => {
    const userCount = await db.User.count();
    const movieCount = await db.Movie.count();
    const categoryCount = await db.Genre.count();
    const countryCount = await db.Country.count();

    renderAdmin(res, 'admin/dashboard', {
        title: 'Admin Dashboard',
        userCount,
        movieCount,
        categoryCount,
        countryCount
    });
};

exports.moviesList = async (req, res) => {
    render(req, res, 'Danh sách phim', db.Movie, 'admin/movies-list', 10, {
        include: [db.Genre, db.Country, db.Episode],
        order: [['updated_at', 'DESC']]
    });
};

exports.usersList = async (req, res) => {
    render(req, res, 'Danh sách người dùng', db.User, 'admin/users-list', 10, {
        include: [],
        order: [['username', 'ASC']]
    });
};

exports.viewMovie = async (req, res) => {
    const movieId = req.params.id;
    try {
        const movie = await db.Movie.findOne({
            where: { id: movieId },
            include: [db.Genre, db.Country, db.Episode]
        });
        if (!movie) {
            req.flash('error_msg', 'Phim không tồn tại');
            return res.redirect('/admin/movies');
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Lỗi khi tải chi tiết phim' });
    }
}

exports.updateAllMovie = async (req, res) => {
    try {
        const updated = await episodeService.syncAllMovies();
        if (updated) {
            req.flash('success_msg', 'Cập nhật tất cả phim thành công');
            return res.redirect('/admin/movies');
        } else {
            req.flash('error_msg', 'Cập nhật tất cả phim thất bại. Vui lòng thử lại sau!');
            return res.redirect('/admin/movies');
        }

    } catch (error) {
        req.flash('error_msg', error.message || 'Thêm phim thất bại');
        res.redirect('/admin/movie/add');
    }
}

exports.getAddMoviePage = async (req, res) => {
    const url = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${req.query.page || 1}`;
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const pagination = response.data.pagination;
        const pages = getPageNumbers(pagination.currentPage, pagination.totalPages);
        const pathImage = 'https://img.ophim.live/uploads/movies/';
        renderAdmin(res, 'admin-add/movie', {
            title: 'Phim mới cập nhật trên Ophim',
            items: response.data.items || [],
            pagination: response.data.pagination || {},
            pages,
            pathImage
        });
    } catch (error) {
        renderAdmin(res, 'admin-add/movie', {
            title: 'Phim mới cập nhật trên Ophim',
            items: [],
            pagination: {},
            pages: []
        });
    }
};

exports.addMovie = async (req, res) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            req.flash('error_msg', 'Đường dẫn phim không hợp lệ');
            return res.redirect('/admin/movie/add');
        }
        const { movie, created } = await movieService.addMovieFromOphim(slug);
        if (created) {
            req.flash('success_msg', 'Thêm phim thành công');
            return res.redirect('/admin/movie/add');
        } else {
            req.flash('error_msg', 'Phim đã tồn tại');
            return res.redirect('/admin/movie/add');
        }

    } catch (error) {
        req.flash('error_msg', error.message || 'Thêm phim thất bại');
        res.redirect('/admin/movie/add');
    }
}

exports.getEditMoviePage = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await db.Movie.findOne({
            where: { id: movieId },
            include: [db.Genre, db.Country]
        });
        if (!movie) {
            req.flash('error_msg', 'Phim không tồn tại');
            return res.redirect('/admin/movies');
        }
        const genres = await db.Genre.findAll();
        const countries = await db.Country.findAll();
        renderAdmin(res, 'admin-edit/movie', {
            title: 'Chỉnh sửa phim',
            movie,
            genres,
            countries
        });
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi tải trang chỉnh sửa phim');
        res.redirect('/admin/movies');
    }
};

exports.editMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movieData = {
            name: req.body.name,
            origin_name: req.body.origin_name,
            year: req.body.year,
            thumb_url: req.body.thumb_url,
            poster_url: req.body.poster_url,
            description: req.body.content,
            status: req.body.status,
            category: Array.isArray(req.body.category) ? req.body.category.map(name => ({ name, slug: slugify.slugify(name) })) : (req.body.category ? [{ name: req.body.category, slug: slugify.slugify(req.body.category) }] : []),
            country: Array.isArray(req.body.country) ? req.body.country.map(name => ({ name, slug: slugify.slugify(name) })) : (req.body.country ? [{ name: req.body.country, slug: slugify.slugify(req.body.country) }] : []),
        }
        console.log(movieData);
        const movie = await movieService.updateMovieV2(movieId, movieData);
        if (movie) {
            req.flash('success_msg', 'Chỉnh sửa phim thành công');
            return res.redirect('/admin/movie/edit/' + movieId);
        } else {
            req.flash('error_msg', 'Phim không tồn tại');
            return res.redirect('/admin/movies');
        }
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi chỉnh sửa phim');
        res.redirect('/admin/movies');
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = movieService.deleteMovie(id);
        if (deleted) {
            req.flash('success_msg', 'Xóa phim thành công');
        } else {
            req.flash('error_msg', 'Xóa phim thất bại');
        }
        res.redirect('/admin/movies');
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi xóa phim');
        res.redirect('/admin/movies');
    }
}

exports.episodesList = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await db.Movie.findByPk(movieId);
        if (!movie) throw new Error('Phim không tồn tại');
        const episodes = await db.Episode.findAll({ where: { movie_id: movieId } });
        renderAdmin(res, 'admin/episodes', {
            title: 'Danh sách tập phim',
            movie,
            episodes
        });
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi tải danh sách tập phim');
        res.redirect('/admin/movies');
    }
};

exports.episodesList2 = async (req, res) => {
    try {
        const slug = req.params.slug;
        movieExisting = await episodeService.checkMovieExist(slug);
        if (movieExisting) {
            req.params.id = movieExisting.id;
            return exports.episodesList(req, res);
        }
        const url = `https://ophim1.com/phim/${slug}`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (response.data.status == 'false') {
            throw new Error('Đường dẫn phim không đúng');
        }
        const movie = response.data.movie;
        const episodes = response.data.episodes || {};
        renderAdmin(res, 'admin/episodes2', {
            title: 'Danh sách tập phim',
            movie,
            episodes: episodes || []
        });
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi tải danh sách tập phim');
        res.redirect('/admin/movie/add');
    }
};

exports.leechEpisodes = async (req, res) => {
    const movieId = req.params.id;
    return episodeService.syncMovieEpisodes(movieId, req, res);
}

exports.getEditUserPage = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.User.findByPk(userId);
        if (!user) {
            req.flash('error_msg', 'Người dùng không tồn tại');
            return res.redirect('/admin/users');
        }
        renderAdmin(res, 'admin-edit/user', {
            title: 'Chỉnh sửa người dùng',
            user
        });
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi tải trang chỉnh sửa người dùng');
        res.redirect('/admin/users');
    }
}

exports.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.User.findByPk(userId);
        if (!user) {
            req.flash('error_msg', 'Người dùng không tồn tại');
            return res.redirect('/admin/users');
        }

        const { username, email } = req.body;
        await user.update({ username, email });
        req.flash('success_msg', 'Chỉnh sửa người dùng thành công');
        res.redirect('/admin/user/' + userId);
    } catch (error) {
        req.flash('error_msg', error.message || 'Chỉnh sửa người dùng thất bại');
        res.redirect('/admin/user/' + req.params.id);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await db.User.destroy({ where: { id: userId } });
        req.flash('success_msg', 'Xóa người dùng thành công');
        res.redirect('/admin/users');
    } catch (error) {
        req.flash('error_msg', error.message || 'Xóa người dùng thất bại');
        res.redirect('/admin/users');
    }
}

function getPageNumbers(current, total) {
    const pages = [];

    if (total < 3) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    }
    else {
        if (current > 1 && current < total) {
            pages.push(current - 1);
            pages.push(current);
            pages.push(current + 1);
        } else if (current === 1) {
            pages.push(current);
            pages.push(current + 1);
        } else if (current === total) {
            pages.push(current - 1);
            pages.push(current);
        }
    }

    return pages;
}