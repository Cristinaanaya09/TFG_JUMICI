'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(
      'Scenes',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        json: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        rutaImage: {
          type: Sequelize.STRING,
          unique: false
        },
        descripcion: {
          type: Sequelize.STRING,
          allowNull: false
        },
        enabled:{
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },
      {
        sync: { force: true }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
