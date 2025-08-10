module.exports = (sequelize, DataTypes) => {
    const MovieCountry = sequelize.define('MovieCountry', {
        movie_id: DataTypes.INTEGER,
        country_id: DataTypes.INTEGER
    }, {
        tableName: 'movie_countries',
        timestamps: false
    });

    return MovieCountry;
};