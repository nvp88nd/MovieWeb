const db = require('../models');
const renderAdmin = require('../helper/renderAdmin');
const genreService = require('../services/genre');
const render = require('../helper/paginateAndRender');

exports.genresList = async (req, res) => {
    render(req, res, 'Danh sách thể loại', db.Genre, 'admin/genres-list', 10, {
        include: [],
        order: [['name', 'ASC']]
    });
};

exports.getAddGenrePage = async (req, res) => {
    renderAdmin(res, 'admin-add/genre', {
        title: 'Thêm thể loại mới'
    });
};

exports.addGenre = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            req.session.message = 'Tên thể loại không được để trống';
            return res.redirect('/admin/genre/add');
        }
        const newGenre = await genreService.addGenre(name);
        if (newGenre instanceof Error) {
            return res.status(500).json({ error: newGenre.message });
        }
        req.flash('success_msg', 'Thêm thể loại thành công');
        res.redirect('/admin/genre/add');
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi thêm thể loại');
        res.redirect('/admin/genre/add');
    }
};

exports.getEditGenrePage = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        req.flash('error_msg', 'ID thể loại không hợp lệ');
        return res.redirect('/admin/genres');
    }

    try {
        const genre = await db.Genre.findByPk(id);
        if (!genre) {
            req.flash('error_msg', 'Thể loại không tồn tại');
            return res.redirect('/admin/genres');
        }
        renderAdmin(res, 'admin-edit/genre', {
            title: 'Chỉnh sửa thể loại',
            genre
        });
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi tải trang chỉnh sửa thể loại');
        res.redirect('/admin/genres');
    }
}

exports.editGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id || !name) {
            req.flash('error_msg', 'ID và tên thể loại không được để trống');
            return res.redirect(`/admin/genre/edit/${id}`);
        }
        const updatedGenre = await genreService.editGenre(id, name);
        if (updatedGenre instanceof Error) {
            return res.status(500).json({ error: updatedGenre.message });
        }
        req.flash('success_msg', 'Chỉnh sửa thể loại thành công');
        res.redirect(`/admin/genre/edit/${id}`);
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi chỉnh sửa thể loại');
        res.redirect(`/admin/genre/edit/${req.params.id}`);
    }
};

exports.deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await genreService.deleteGenre(id);
        if (deleted) {
            req.flash('success_msg', 'Xóa thể loại thành công');
        } else {
            req.flash('error_msg', 'Xóa thể loại thất bại');
        }
        res.redirect('/admin/genres');
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi xóa thể loại');
        res.redirect('/admin/genres');
    }
}