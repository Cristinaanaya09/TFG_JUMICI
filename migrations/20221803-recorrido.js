'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(
      'Recorridos',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
        },
        escena: {
          type: Sequelize.STRING,
          unique: true
        },
        user: {
          type: Sequelize.STRING,
          unique: true
        },
        anwers: {
          type: Sequelize.STRING,
          unique: false
        },
        tiempo: {
          type: Sequelize.STRING,
          unique: false
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
    return queryInterface.dropTable('Recorridos');
  }
};
