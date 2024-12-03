const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    nameRegister: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailRegister: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    passwordRegister: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);
User.sync({})
  .then(() => {
    console.log("tabela de usuario");
  })
  .catch((err) => console.log("Erro ao criar a tabela de Manga", err));

module.exports = User;
