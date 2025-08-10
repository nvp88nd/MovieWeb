const db = require('../models');

exports.homePage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 24;
        const offset = (page - 1) * limit;

        const { count, rows: movies } = await db.Movie.findAndCountAll({
            include: [db.Genre, db.Country, db.Episode],
            order: [['updated_at', 'DESC']],
            limit,
            offset,
            distinct: true
        });
        if (!movies || movies.length === 0) {
            return res.status(404).send('Không tìm thấy phim nào.');
        }

        const totalPages = Math.ceil(count / limit);

        function getPageNumbers(current, total) {
            const pages = [];
            if (total <= 5) {
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                if (current > 3) pages.push('...');
                const start = Math.max(2, current - 1);
                const end = Math.min(total - 1, current + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (current < total - 2) pages.push('...');
                pages.push(total);
            }
            return pages;
        }

        const pages = getPageNumbers(page, totalPages);

        res.render('home', {
            title: 'Xem phim hay',
            movies: movies,
            currentPage: page,
            totalPages,
            pages
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
}
