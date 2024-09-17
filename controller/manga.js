const { where } = require("sequelize");
const Manga = require("../models/Manga_model");
const Sequelize = require("sequelize");
let Log = require("../middleware/logAdmin");
const Op = Sequelize.Op;
const bcrypt = require("bcryptjs");
const User = require("../models/User_model");
class Mangas_Controller {
  static async getSeeManga(req, res) {
    let adminAcess = req.session.userAdmin;
    let userLog = req.session.user;
    let userLogName = req.session.userName;
    Manga.findOne({ where: { id: req.params.id } })
      .then((manga) => {
        //criei uma variavel ja com valor do ano(não da pra fazer isso no handlebars)
        const publicationYear = manga.publicationDate.getFullYear();
        res.render("manga/manga_info", {
          manga,
          publicationYear,
          userLog,
          userLogName,
          adminAcess,
        });
      })
      .catch((err) => console.log(err));
  }
  static async getAdd(req, res) {
    let adminAcess = req.session.userAdmin;
    res.render("manga/addManga", { adminAcess });
  }
  static async postAddManga(req, res) {
    let {
      title,
      author,
      genre,
      publisher,
      language,
      coverImage,
      publicationDate,
      status,
      description,
      linkAnime,
    } = req.body;

    Manga.create({
      title,
      author,
      genre,
      publisher,
      language,
      coverImage,
      publicationDate,
      status,
      description,
      linkAnime,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).send("Ocorreu um Erro" + err);
      });
  }

  static async getSearchManga(req, res) {
    let adminAcess = req.session.userAdmin;
    let userLog = req.session.user;
    let userLogName = req.session.userName;
    let search = req.query.search;
    let searchDB = "%" + search + "%";
    await Manga.findAll({ where: { title: { [Op.like]: searchDB } } })
      .then((mangas) => {
        res.render("home/home", {
          mangas,
          search,
          adminAcess,
          userLog,
          userLogName,
        });
      })
      .catch((err) => {
        console.log(`Ocorreu um Erro: ${err}`);
      });
  }
  static async getMangaByGenre(req, res) {
    let adminAcess = req.session.userAdmin;
    let userLog = req.session.user;
    let userLogName = req.session.userName;
    let genreReq = req.params.genre;
    Manga.findAll({ where: { genre: genreReq } })
      .then((mangas) => {
        res.render("home/home", {
          mangas,
          genreReq,
          userLog,
          userLogName,
          adminAcess,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static async getLogAdm(req, res) {
    res.render("admin/adminAcess");
  }

  static async postLogAdm(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);
    let validation = bcrypt.compareSync(password, hash);
    console.log(password);
    console.log(email);
    if (email == process.env.ADMIN_EMAIL && validation) {
      req.session.userAdmin = email;
      res.redirect("/manga/admin/acess");
    } else {
      res.status(401).send("Email ou senha inválidos.");
    }
  }
  static async postLogoutAdmin(req, res) {
    req.session.userAdmin = false;
    res.redirect("/");
  }
  static async getAllMangas(req, res) {
    let adminAcess = req.session.userAdmin;
    let userLog = req.session.user;
    let userLogName = req.session.userName;
    let mangaSalve = req.session.mangaSalveMsg;
    let userId = req.session.userId;

    console.log("Admin Access:", adminAcess);
    console.log("User Logged In:", userLog);
    console.log("User Name:", userLogName);

    try {
      let mangas = await Manga.findAll();

      if (userLog) {
        const user = await User.findByPk(userId);
        const mangasSave = await user.getMangas();
        if (user && mangasSave) {
          

          mangas.forEach((manga) => {
            const savedManga = mangasSave.find(
              (mangaSaved) => mangaSaved.id === manga.id
            ); //compara o manga.id a todos os objeto do mangasSave
            if (savedManga) {
              //se ter um com o mesmo id ele pega essa instancia e bota a propriedade mangaSaved = "save-icon-full.png"
              manga.mangaSaved = "save-icon-full.png";
              console.log("Manga", manga.title, "está salvo");
            }
          });
        }
      }

      res.render("home/home", {
        mangas,
        adminAcess,
        userLog,
        userLogName,
        mangaSalve,
      });
      req.session.mangaSalveMsg = false;
    } catch (error) {
      console.error("Erro ao carregar mangas:", error);
      res.status(500).send("Erro interno do servidor");
    }
  }

  static async getDel(req, res) {
    let mangaDelId = req.params.id;
    let mangaDel = await Manga.findOne({ where: { id: mangaDelId } });
    if (mangaDel) {
      await mangaDel.destroy();
      console.log("Manga deletado");
      res.status(200).json({ message: "Manga deletado com sucesso." });
    } else {
      res.status(404).json({ message: "Manga não encontrado." });
    }
  }

  static async getData(req, res) {
    let adminAcess = req.session.userAdmin;
    Manga.findOne({ where: { id: req.params.id } }).then((manga) => {
      //criei uma variavel ja com valor do ano(não da pra fazer isso no handlebars)

      res.render("manga/putData", { manga, adminAcess });
    });
  }
  static async putData(req, res) {
    try {
      let adminAccess = req.session.userAdmin;
      let id = req.params.id;

      let {
        title,
        author,
        genre,
        publisher,
        language,
        coverImage,
        publicationDate,
        status,
        description,
        linkAnime,
      } = req.body;
      console.log("Dados recebidos:", {
        title,
        author,
        genre,
        publisher,
        language,
        coverImage,
        publicationDate,
        status,
        description,
        linkAnime,
      });

      
      const [updated] = await Manga.update(
        {
          title,
          author,
          genre,
          publisher,
          language,
          coverImage,
          publicationDate,
          status,
          description,
          linkAnime,
        },
        { where: { id } }
      );

      
      if (updated > 0) {
        res.status(200).json({ message: "Manga atualizado com sucesso." });
      } else {
        res.status(404).json({ message: "Manga não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao atualizar o manga:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

module.exports = Mangas_Controller;
