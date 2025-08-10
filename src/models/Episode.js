module.exports = (sequelize, DataTypes) => {
    const Episode = sequelize.define('Episode', {
        movie_id: { type: DataTypes.INTEGER, allowNull: false },
        server_name: DataTypes.STRING,
        episode_name: DataTypes.STRING,
        video_url: DataTypes.TEXT
    }, {
        tableName: 'episodes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Episode.associate = (models) => {
        Episode.belongsTo(models.Movie, { foreignKey: 'movie_id' }); // n-1
    };

    return Episode;
};