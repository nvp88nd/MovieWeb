const db = require('../models');
const paginate = require('../helper/paginate');

exports.homePage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 24;

        const { rows: movies, currentPage, totalPages, pages } = await paginate(db.Movie, page, limit, {
            include: [db.Genre, db.Country, db.Episode],
            order: [['updated_at', 'DESC']]
        });

        res.render('home', {
            title: 'Xem phim hay',
            movies,
            currentPage,
            totalPages,
            pages,
            tag: 'Mới cập nhật',
            query: ''
        });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}


exports.searchMovies = async (req, res) => {
    const q = (req.query.q || "").trim();

    if (!q) {
        req.flash('error_msg', 'Từ khóa tìm kiếm không được để trống');
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 24;

        const { rows: movies, currentPage, totalPages, pages } = await paginate(db.Movie, page, limit, {
            where: {
                [db.Sequelize.Op.or]: [
                    { title: { [db.Sequelize.Op.like]: `%${q}%` } },
                    { origin_name: { [db.Sequelize.Op.like]: `%${q}%` } }
                ]
            },
            include: [db.Genre, db.Country, db.Episode],
            order: [['updated_at', 'DESC']]
        });

        res.render('home', {
            title: `Tìm kiếm`,
            movies,
            currentPage,
            totalPages,
            pages,
            tag: `Tìm kiếm từ khóa "${q}"`,
            query: q
        });
    } catch (err) {
        req.flash('error_msg', err.message || 'Lỗi khi tìm kiếm phim');
        res.redirect('/');
    }
};
