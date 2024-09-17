let log = false;

function auth(req, res, next) {
  if (req.session.userAdmin) {
    next();
  } else {
    console.log("erro");
  }
}
module.exports = auth;
