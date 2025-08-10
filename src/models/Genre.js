module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
        name: { type: DataTypes.STRING, unique: true },
        slug: { type: DataTypes.STRING, unique: true }
    }, {
        tableName: 'genres',
        timestamps: false
    });

    Genre.associate = (models) => {
        Genre.belongsToMany(models.Movie, { through: models.MovieGenre, foreignKey: 'genre_id' });
    };

    return Genre;
};