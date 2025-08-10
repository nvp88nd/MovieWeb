module.exports = (sequelize, DataTypes) => {
    const SavedMovie = sequelize.define('SavedMovie', {
        user_id: DataTypes.INTEGER,
        movie_id: DataTypes.INTEGER
    }, {
        tableName: 'saved_movies',
        timestamps: true,
        createdAt: 'saved_at',
        updatedAt: false
    });

    SavedMovie.associate = (models) => {
        SavedMovie.belongsTo(models.User, { foreignKey: 'user_id' });
        SavedMovie.belongsTo(models.Movie, { foreignKey: 'movie_id' });
    };

    return SavedMovie;
};