const db = require('../models');
const renderAdmin = require('../helper/renderAdmin');
const render = require('../helper/paginateAndRender');
const e = require('connect-flash');

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
        order: [['created_at', 'DESC']]
    });
};

exports.usersList = async (req, res) => {
    render(req, res, 'Danh sách người dùng', db.User, 'admin/users-list', 10, {
        include: [],
        order: [['created_at', 'ASC']]
    });
};

exports.getCrawlMoviePage = async (req, res) => {
    renderAdmin(res, 'admin-add/crawlMovie', {
        title: 'Thêm phim mới'
    });
};

exports.crawlMovie = async (req, res) => {

};

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