require("dotenv").config();
const express = require("express");


const app = express();
const { engine } = require("express-handlebars");
const path = require("path");
const db = require("./db/connection"); //pega a instancia sequelize(a que exportei) so executa o codigo de dentro de connection agora que exportamos;
let port = 3000;
const Manga = require("./models/Manga_model");
const User = require("./models/User_model");
const Associations = require("./models/Associations_UserManga");
const Mangas_Controller = require("./controller/manga");

//criando seção
const session = require("express-session");
app.use(
  session({
    secret: "sua-chave-secreta",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Deve ser true em produção com HTTPS
  })
);
//definindo handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));
app.listen(port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


db.authenticate()
  .then(() => {
    console.log("Conectou ao banco");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  Mangas_Controller.getAllMangas(req, res);
});

app.use("/manga", require("./routes/manga_route"));
app.use("/user", require("./routes/user_routes"));
app.use((req, res, next) => {
  res.status(404).render("404/404");
});
