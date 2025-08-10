module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        name: { type: DataTypes.STRING, unique: true },
        slug: { type: DataTypes.STRING, unique: true }
    }, {
        tableName: 'countries',
        timestamps: false
    });

    Country.associate = (models) => {
        Country.belongsToMany(models.Movie, { through: models.MovieCountry, foreignKey: 'country_id' });
    };

    return Country;
};