const db = require('../models');
const renderAdmin = require('../helper/renderAdmin');
const countryService = require('../services/country');
const render = require('../helper/paginateAndRender');

exports.countriesList = async (req, res) => {
    render(req, res, 'Danh sách quốc gia', db.Country, 'admin/countries-list', 10, {
        include: [],
        order: [['name', 'ASC']]
    });
};

exports.getAddCountryPage = async (req, res) => {
    renderAdmin(res, 'admin-add/country', {
        title: 'Thêm quốc gia mới'
    });
};

exports.addCountry = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            req.flash('error_msg', 'Tên quốc gia không được để trống');
            return res.redirect('/admin/country/add');
        }
        const newCountry = await countryService.addCountry(name);
        if (newCountry instanceof Error) {
            return res.status(500).json({ error: newCountry.message });
        }
        req.flash('success_msg', 'Thêm quốc gia thành công');
        res.redirect('/admin/country/add');
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi thêm quốc gia');
        res.redirect('/admin/country/add');
    }
};

exports.getEditCountryPage = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        req.flash('error_msg', 'ID quốc gia không hợp lệ');
        return res.redirect('/admin/countries');
    }

    try {
        const country = await db.Country.findByPk(id);
        if (!country) {
            req.flash('error_msg', 'Quốc gia không tồn tại');
            return res.redirect('/admin/countries');
        }
        renderAdmin(res, 'admin-edit/country', {
            title: 'Chỉnh sửa quốc gia',
            country
        });
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi lấy thông tin quốc gia');
        res.redirect('/admin/countries');
    }
}

exports.editCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id || !name) {
            req.flash('error_msg', 'ID và tên quốc gia không được để trống');
            return res.redirect(`/admin/country/edit/${id}`);
        }
        const updatedCountry = await countryService.editCountry(id, name);
        if (updatedCountry instanceof Error) {
            return res.status(500).json({ error: updatedCountry.message });
        }
        req.flash('success_msg', 'Chỉnh sửa quốc gia thành công');
        res.redirect(`/admin/country/edit/${id}`);
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi chỉnh sửa quốc gia');
        res.redirect(`/admin/country/edit/${req.params.id}`);
    }
}

exports.deleteCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await countryService.deleteCountry(id);
        if (deleted) {
            req.flash('success_msg', 'Xóa quốc gia thành công');
        } else {
            req.flash('error_msg', 'Xóa quốc gia thất bại');
        }
        res.redirect('/admin/countries');
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi xóa quốc gia');
        res.redirect('/admin/countries');
    }
}