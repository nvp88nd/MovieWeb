module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        movie_id: { type: DataTypes.INTEGER, allowNull: false },
        content: DataTypes.TEXT
    }, {
        tableName: 'comments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, { foreignKey: 'user_id' });
        Comment.belongsTo(models.Movie, { foreignKey: 'movie_id' });
    };

    return Comment;
};