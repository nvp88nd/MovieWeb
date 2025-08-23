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
            pages
        });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}
