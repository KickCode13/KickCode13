const { where } = require("sequelize");
const User = require("../models/User_model");
const Mangas_Controller = require("./manga");
const Manga = require("../models/Manga_model");
const { UserManga } = require("../models/Associations_UserManga");
const url = require("url");
class User_Controller {
  static async getLoginUser(req, res) {
    let msgError = req.session.errorMsg; //pega msg se erro na seção se existir
    res.render("user/loginUser", { msgError }); //manda pra lado do navegador
    req.session.errorMsg = false; //volta ou permanece false;
  }
  static async postLoginUser(req, res, reg = false) {
    if (reg == true) {
      let { passwordRegister, emailRegister } = req.body;
      let findUser = User.findOne({
        where: { passwordRegister, emailRegister },
      })
        .then((user) => {
          if (user) {
            req.session.user = user.emailRegister;
            req.session.userName = user.nameRegister;
            req.session.userId = user.id;
            console.log("Login efetuado com sucesso");
            res.redirect("/");
          } else {
            req.session.errorMsg = true; //armazena que ouve um erro
            res.redirect("/user/login"); //ira pra a rota get
          }
        })
        .catch((err) => {
          console.log("Ocorreu um Erro", err);
        });
    } else {
      let { emailLogin, passwordLogin } = req.body;
      let findUser = await User.findOne({
        where: {
          emailRegister: emailLogin,
          passwordRegister: passwordLogin,
        },
      })
        .then((user) => {
          if (user) {
            req.session.user = user.emailRegister;
            req.session.userName = user.nameRegister;
            req.session.userId = user.id;
            console.log("Login efetuado com sucesso! pelo login direto");
            res.redirect("/");
          } else {
            req.session.errorMsg = true; //armazena que ouve um erro
            res.redirect("/user/login"); //ira pra a rota get
          }
        })
        .catch((err) => {
          console.log("Ocorreu um Erro", err);
        });
    }
  }
  static async postLogout(req, res) {
    req.session.user = null;
    req.session.userName = null;
    req.session.userId = null;
    res.redirect("/"); //pensando em algo lado do navegador
  }
  static async getRegisterUser(req, res) {
    let isUserExists = req.session.userExists;
    req.session.userExists = false;
    res.render("user/registerUser", { isUserExists });
  }
  static async postRegisterUser(req, res) {
    let { nameRegister, emailRegister, passwordRegister } = req.body;
    let findUser = await User.findOne({
      where: { emailRegister },
    }).catch((err) => {
      console.log("Ocorreu um Erro", err);
    });
    if (findUser) {
      console.log(findUser.emailRegister);
      req.session.userExists = true;
      res.redirect("/user/register");
    } else {
      User.create({ nameRegister, emailRegister, passwordRegister })
        .then(() => {
          console.log("Registro feico com sucesso!");
          let reg = true;
          User_Controller.postLoginUser(req, res, reg);
        })
        .catch((err) => {
          console.log("Ocorreu um Erro", err);
        });
    }
  }
  static async postSaveManga(req, res) {
    const mangaId = req.params.id;
    const userId = req.session.userId;

    const user = await User.findByPk(userId).catch((err) => {
      console.log(err);
    }); //encontra pela primary key
    const manga = await Manga.findByPk(mangaId).catch((err) => {
      console.log(err);
    }); //encontra pela primary key
    const userManga = await UserManga.findOne({
      where: {
        UserId: userId,
        MangaId: mangaId,
      },
    }).catch((err) => {
      console.log(err);
    });
    if (user && manga) {
      if (userManga) {
        await user.removeManga(manga).catch((err) => {
          console.log(err);
        });
        res.redirect("/");
      } else {
        user.addManga(manga).catch((err) => {
          console.log(err);
        });
        req.session.mangaSalveMsg = true;
        console.log(`o manga ${manga.title} esta ==`, manga.mangaSaved);
        res.redirect("/");
      }
    }
  }
  static async getMangasSaves(req, res) {
    const adminAcess = req.session.userAdmin;
    const userLog = req.session.user;
    const userLogName = req.session.userName;
    const userId = req.session.userId;

    const user = await User.findOne({ where: { id: userId } }).catch((err) => {
      console.log(err);
    });
    let getMangas = await user.getMangas().catch((err) => {
      console.log(err);
    });

    if (user && getMangas) {
      let mangas = getMangas; //mesmo nome de como ta em home pra reutilizar
      mangas.forEach((manga) => {
        manga.mangaSaved = "save-icon-full.png";
        console.log("Manga", manga.title, "está salvo");
      });
      let savesMangas = "Mangas salvos";
      res.render("home/home", {
        mangas,
        savesMangas,
        userLog,
        userLogName,
        adminAcess,
      });
    }
  }
}
module.exports = User_Controller;
