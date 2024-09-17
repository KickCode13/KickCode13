const express = require("express");
const router = express.Router();
const {
  getSeeManga,
  postAddManga,
  getSearchManga,
  getMangaByGenre,
  getLogAdm,
  postLogAdm,
  getDel,
  getData,
  putData,
  getAdd,
  postLogoutAdmin,
  getAllMangas,
} = require("../controller/manga");
const auth = require("../middleware/logAdmin");

router.get("/add", getAdd);
router.post("/add", postAddManga);
router.get("/views/:id", getSeeManga);
router.get("/search", getSearchManga);
router.get("/genre/:genre", getMangaByGenre);
router.get("/admin/login", getLogAdm);
router.post("/admin/login", postLogAdm);
router.get("/admin/acess", auth, getAllMangas);
router.post("/logout", postLogoutAdmin);
router.delete("/del/:id", getDel);

router.get("/edit/:id", getData);
router.put("/edit/:id", putData);

module.exports = router;
