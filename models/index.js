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
    role: {
      type: DataTypes.STRING,
      enum: ["ALUMNO", "PROFE"]
    }
  }, 
  { sequelize }
); 
module.exports = sequelize;


class UserAnswer extends Model {}
UserAnswer.init(
  { 
    user: DataTypes.INTEGER,
    scene: DataTypes.INTEGER,
    question: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    time: DataTypes.STRING,
    correct: DataTypes.INTEGER,
  }, 
  { sequelize }
);

class Scene extends Model {}
Scene.init(
  { 
    name: DataTypes.STRING,
    rutaImage: DataTypes.STRING,
    descripcion: DataTypes.STRING,
  }, 
  { sequelize }
);

class Answer extends Model {}
Answer.init(
  { scene: DataTypes.INTEGER,
    question: DataTypes.INTEGER,
    answer: DataTypes.INTEGER,
  }, 
  { sequelize }
);

Answer.belongsToMany(User, {
  as: 'users',
  through: 'Answers',
  foreignKey: 'user'//OJO esta es la clave de la tabla de GroupQuizzes para definir a los quiz
});

User.belongsToMany(Answer, {
  as: 'answers',  //OJO todas las fucniones ....group.xxxQuizzes se llamrán según este alias.
  through: 'Answers',
  foreignKey: 'user', //OJO esta es la clave de la tabla de GroupQuizzes para definir a los quiz
});

module.exports = sequelize;

