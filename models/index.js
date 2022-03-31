const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize("sqlite:user.sqlite");

class User extends Model {}
console.log("MODELO BASE DE DATOS")

User.init(
  { name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      unique: { msg: "Name already exists"}
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, 
  { sequelize }
); 
module.exports = sequelize;


class Answer extends Model {}
Answer.init(
  { question: DataTypes.STRING,
    answer: DataTypes.STRING,
  }, 
  { sequelize }
);

class Recorrido extends Model {}
Recorrido.init(
  { escena: DataTypes.STRING,
    user: DataTypes.STRING,
    answers: DataTypes.STRING,
    tiempo: DataTypes.STRING,
  }, 
  { sequelize }
);
module.exports = sequelize;

