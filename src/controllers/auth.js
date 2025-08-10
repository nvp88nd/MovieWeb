const authService = require('../services/auth');
const authRepo = require('../repositories/auth');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
        const user = await authService.login(email, password);
        // Payload chứa thông tin cần thiết
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 // 1 giờ
        });
        res.redirect('/');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getLoginPage = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('auth/login', {
        title: 'Login',
        error: null
    });
}

exports.register = async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    if (!username || !email || !password || !confirm_password) {
        return res.render('register', { error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    if (password !== confirm_password) {
        return res.render('register', { error: 'Mật khẩu xác nhận không khớp.' });
    }

    try {
        await authService.register({ username, email, password, avatar_url: 'images/test.jpg' });
        res.redirect('/login');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getRegisterPage = (req, res) => {
    res.render('auth/register', {
        title: 'Register',
        error: null
    });
}

exports.getProfile = async (req, res) => {
    try {
        const user = await authRepo.getUserById(req.user.id);
        res.render('auth/profile', {
            title: 'Profile',
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const updatedData = req.body;

    try {
        const updatedUser = await authService.updateUser(userId, updatedData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.redirect('/login');
};
