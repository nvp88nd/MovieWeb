const bcrypt = require('bcrypt');
const authRepo = require('../repositories/auth');

exports.login = async (email, password) => {
    try {
        const user = await authRepo.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
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
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        return authRepo.createUser(userData);
    } catch (error) {
        throw error;
    }
}