const db = require('../models');
const slugify = require('../helper/slugify');

exports.addCountry = async (name) => {
    if (!name) {
        throw new Error('Tên quốc gia không được để trống');
    }
    const slug = slugify.slugify(name);

    const existingCountry = await db.Country.findOne({ where: { slug } });
    if (existingCountry) {
        throw new Error('Quốc gia đã tồn tại');
    }

    try {
        const newCountry = await db.Country.create({ name, slug });
        return newCountry;
    } catch (error) {
        throw new Error('Lỗi khi thêm quốc gia');
    }
}

exports.editCountry = async (id, name) => {
    if (!id || !name) {
        throw new Error('ID và tên quốc gia không được để trống');
    }
    const slug = slugify.slugify(name);

    const existingCountry = await db.Country.findOne({ where: { slug, id: { [db.Sequelize.Op.ne]: id } } });
    if (existingCountry) {
        throw new Error('Quốc gia đã tồn tại');
    }

    try {
        const updatedCountry = await db.Country.update({ name, slug }, { where: { id } });
        return updatedCountry;
    } catch (error) {
        throw new Error('Lỗi khi chỉnh sửa quốc gia');
    }
}

exports.deleteCountry = async (id) => {
    if (!id) {
        throw new Error('ID quốc gia không hợp lệ');
    }

    try {
        const deletedCountry = await db.Country.destroy({ where: { id } });
        return deletedCountry;
    } catch (error) {
        throw new Error('Lỗi khi xóa quốc gia');
    }
}