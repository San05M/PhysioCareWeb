const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
let User = require(__dirname + "/../models/user.js");

let router = express.Router();

router.get("/login", (req, res) => {
  res.render("/login");
});