const User = require("./User_model");
const Manga = require("./Manga_model");
const sequelize = require("../db/connection");
Manga.belongsToMany(User, { through: "UserManga" });
User.belongsToMany(Manga, { through: "UserManga" });
sequelize
  .sync({ alter: true }) //PODE TIRAR O {ALTER:TRUE} SE DER BO
  .then(() => {
    console.log("Tabelas e associações criadas com sucesso");
  })
  .catch((err) => {
    console.log("Erro ao criar as tabelas e associações:", err);
  });
module.exports = { Manga, User, UserManga: sequelize.models.UserManga };
