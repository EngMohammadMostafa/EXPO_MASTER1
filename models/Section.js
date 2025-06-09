module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
    name: {
      type: DataTypes.STRING(35),
      allowNull: false,
    },
    departments_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exhibitor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Section.associate = (models) => {
    Section.belongsTo(models.User, {
      foreignKey: 'exhibitor_id',
      as: 'exhibitor',
    });

    Section.belongsTo(models.Department, {
      foreignKey: 'departments_id',
      as: 'department',
    });
  };

  return Section;
};
