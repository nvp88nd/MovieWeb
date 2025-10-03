const db = require('../models');

module.exports = async (req, res, next) => {
    try {
        const [genres, countries] = await Promise.all([
            db.Genre.findAll({ order: [['name', 'ASC']] }),
            db.Country.findAll({ order: [['name', 'ASC']] })
        ]);

        res.locals.genres = genres;
        res.locals.countries = countries;
    } catch (error) {
        console.error("Error loading filters:", error);
        res.locals.genres = [];
        res.locals.countries = [];
    }
    next();
};
