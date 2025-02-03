const express = require("express");
const bcrypt = require("bcrypt");
let User = require(__dirname + "/../models/user.js");

let router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
let login = req.body.login;
let password = req.body.password;
let realUser = await User.findOne({ login: login });

if(realUser && bcrypt.compareSync(password, realUser.password)){
  req.session.login = realUser.login;
  req.session.password = realUser.password;
  req.session.rol = realUser.rol;
  res.redirect("/patients");
} else res.render("auth/login", { error: "Invalid login or password"});
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
    });

module.exports = router;