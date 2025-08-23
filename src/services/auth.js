const bcrypt = require('bcrypt');
const authRepo = require('../repositories/auth');

exports.login = async (email, password) => {
    try {
        const user = await authRepo.getUserByEmail(email);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Mật khẩu không đúng');
        }

        return user;
    } catch (error) {
        throw error;
    }
}

exports.register = async (userData) => {
    try {
        const existingUser = await authRepo.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        return authRepo.createUser(userData);
    } catch (error) {
        throw error;
    }
}

exports.updateUser = async (userId, updatedData) => {
    try {
        const existingUser = await authRepo.getUserById(userId);
        if (!existingUser) {
            throw new Error('Người dùng không tồn tại');
        }

        return await existingUser.update(updatedData);
    } catch (error) {
        throw error;
    }
}