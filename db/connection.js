const Sequelize = require("sequelize"); //importa o modulo sequelize pra iteragir com o banco
const sequelize = new Sequelize({
  //cria uma instância do Sequelize
  dialect: "sqlite", //define o banco que estou usando
  storage: "./db/app.db", //lugar que o banco esta armazenado(se não houver criara automatico)
});

module.exports = sequelize; //exporta a varivel sequelize(instancia que criei da ORM de do Sequelize)
