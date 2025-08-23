const db = require('../models');
const slugify = require('../helper/slugify');
const e = require('express');

exports.addGenre = async (name) => {
    if (!name) {
        throw new Error('Tên thể loại không được để trống');
    }
    const slug = slugify.slugify(name);

    const existingGenre = await db.Genre.findOne({ where: { slug } });
    if (existingGenre) {
        throw new Error('Thể loại đã tồn tại');
    }

    try {
        const newGenre = await db.Genre.create({ name, slug });
        return newGenre;
    } catch (error) {
        throw new Error('Lỗi khi thêm thể loại');
    }
};

exports.editGenre = async (id, name) => {
    if (!id || !name) {
        throw new Error('ID và tên thể loại không hợp lệ');
    }

    const slug = slugify.slugify(name);
    const existingGenre = await db.Genre.findOne({ where: { slug, id: { [db.Sequelize.Op.ne]: id } } });
    if (existingGenre) {
        throw new Error('Thể loại đã tồn tại');
    }
    try {
        const updatedGenre = await db.Genre.update({ name, slug }, { where: { id } });
        return updatedGenre;
    } catch (error) {
        throw new Error('Lỗi khi chỉnh sửa thể loại');
    }
};

exports.deleteGenre = async (id) => {
    if (!id) {
        throw new Error('ID thể loại không hợp lệ');
    }
    try {
        const deletedGenre = await db.Genre.destroy({ where: { id } });
        return deletedGenre;
    } catch (error) {
        throw new Error(error.message || 'Lỗi khi xóa thể loại');
    }
};
