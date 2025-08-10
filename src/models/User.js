module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: { type: DataTypes.STRING, unique: true, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: DataTypes.STRING,
        avatar_url: DataTypes.TEXT,
        role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    User.associate = (models) => {
        User.hasMany(models.Comment, { foreignKey: 'user_id' });
        User.hasMany(models.SavedMovie, { foreignKey: 'user_id' });
    };

    return User;
};