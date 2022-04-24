'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(
      'Answers',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
        },
        game:{
          type: Sequelize.INTEGER,
          foreignKey: true,
          references: {
            model: "Scenes",
            key: "id"
          },
          onUpdate: 'CASCADE',
          allowNull: false,
        },
        scene: {
          type: Sequelize.STRING,
          unique: false
        },
        question: {
          type: Sequelize.STRING,
          unique: false
        },
        answer: {
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
