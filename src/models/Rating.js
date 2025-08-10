module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
        movie_id: DataTypes.INTEGER,
        rating: {
            type: DataTypes.FLOAT,
            validate: { min: 0, max: 10 }
        }
    }, {
        tableName: 'ratings',
        timestamps: false
    });

    Rating.associate = (models) => {
        Rating.belongsTo(models.Movie, { foreignKey: 'movie_id' });
    };

    return Rating;
};
