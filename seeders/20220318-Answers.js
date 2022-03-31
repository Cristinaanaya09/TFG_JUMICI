'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Answers', [
      {question: "prueba",
        answer:  "prueba",
        createdAt: new Date(),
        updatedAt: new Date()      
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Answers', null, {});
  }
};
