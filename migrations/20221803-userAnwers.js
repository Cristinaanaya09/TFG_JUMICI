'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(
      'UserAnswers',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
        },
        user:{
          type: Sequelize.INTEGER,
          foreignKey: true,
          references: {
            model: "Users",
            key: "id"
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        scene:{
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        question: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        answer: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        time: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        correct: {
          type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Answers');
  }
};
