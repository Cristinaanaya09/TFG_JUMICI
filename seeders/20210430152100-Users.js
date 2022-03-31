'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        username: 'Admin254',
        email: 'admin254@game.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'User',
        username: 'user254',
        email: 'user254@game.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
  }
};
