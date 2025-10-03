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

exports.filterMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 24;

        const where = {};
        const include = [
            { model: db.Genre },
            { model: db.Country },
            { model: db.Episode }
        ];
        let tag = '';

        if (req.query.genre) {
            include[0].where = { slug: req.query.genre };
            include[0].required = true;
            const genre = await db.Genre.findOne({ where: { slug: req.query.genre } });
            if (genre) {
                tag = `Thể loại: ${genre.name}`;
            }
        }

        if (req.query.country) {
            include[1].where = { slug: req.query.country };
            include[1].required = true;
            const country = await db.Country.findOne({ where: { slug: req.query.country } });
            if (country) {
                tag = `Quốc gia: ${country.name}`;
            }
        }

        const { rows: movies, currentPage, totalPages, pages } = await paginate(
            db.Movie,
            page,
            limit,
            {
                where,
                include,
                order: [['updated_at', 'DESC']]
            }
        );

        res.render('home', {
            title: 'Danh sách phim',
            movies,
            currentPage,
            totalPages,
            pages,
            tag: tag,
            query: ''
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Error: ' + error.message);
    }
};