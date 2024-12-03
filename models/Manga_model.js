const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const { toDefaultValue } = require("sequelize/lib/utils");

const Manga = sequelize.define("Manga", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  linkAnime: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  mangaSaved: {
    //não adicanta salvar aqui pois seções de outros usuarios seriam afetadas
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "save-icon-empy.png",
  },
});

Manga.sync({ })
  .then(() => {
    console.log("tabela de manga criada com sucesso");
  })
  .catch((err) => console.log("Erro ao criar a tabela de Manga", err));

module.exports = Manga;
