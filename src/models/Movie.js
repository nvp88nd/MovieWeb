module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        slug: { type: DataTypes.STRING, allowNull: false, unique: true },
        title: DataTypes.STRING,
        origin_name: DataTypes.STRING,
        year: DataTypes.INTEGER,
        thumb_url: DataTypes.TEXT,
        poster_url: DataTypes.TEXT,
        description: DataTypes.TEXT,
        status: DataTypes.STRING
    }, {
        tableName: 'movies',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Movie.associate = (models) => {
        Movie.hasMany(models.Episode, { foreignKey: 'movie_id' });
        Movie.belongsToMany(models.Genre, { through: models.MovieGenre, foreignKey: 'movie_id' });
        Movie.belongsToMany(models.Country, { through: models.MovieCountry, foreignKey: 'movie_id' }); //n-n
        Movie.hasMany(models.Comment, { foreignKey: 'movie_id' }); // 1-n
        Movie.hasMany(models.SavedMovie, { foreignKey: 'movie_id' });
        Movie.hasMany(models.Rating, { foreignKey: 'movie_id' });
    };

    return Movie;
};