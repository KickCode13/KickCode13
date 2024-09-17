const express = require("express");
const router = express.Router();
const {
  getLoginUser,
  getRegisterUser,
  postRegisterUser,
  postLoginUser,
  postLogout,
  postSaveManga,
  getMangasSaves,
} = require("../controller/user");

router.get("/login", getLoginUser);
router.post("/login", postLoginUser);
router.get("/register", getRegisterUser);
router.post("/register", postRegisterUser);
router.post("/logout", postLogout);
router.post("/save/:id", postSaveManga);
router.get("/save", getMangasSaves);
module.exports = router;
