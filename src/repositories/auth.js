const db = require('../models');

exports.getUserById = async (id) => {
    try {
        return await db.User.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.getUserByEmail = async (email) => {
    try {
        return await db.User.findOne({ where: { email } });
    } catch (error) {
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        return await db.User.findAll();
    } catch (error) {
        throw error;
    }
}

exports.createUser = async (userData) => {
    try {
        return await db.User.create(userData);
    } catch (error) {
        throw error;
    }
}