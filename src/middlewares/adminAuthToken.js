function isAdmin(req, res, next) {
    if (res.locals.user && res.locals.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('Bạn không có quyền truy cập trang này.');
}

module.exports = isAdmin;
