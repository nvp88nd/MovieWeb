module.exports = (sequelize, DataTypes) => {
    const MovieGenre = sequelize.define('MovieGenre', {
        movie_id: DataTypes.INTEGER,
        genre_id: DataTypes.INTEGER
    }, {
        tableName: 'movie_genres',
        timestamps: false
    });

    return MovieGenre;
};