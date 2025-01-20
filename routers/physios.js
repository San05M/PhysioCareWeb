const express = require("express");
let Physio = require(__dirname + "/../models/physio.js");

let router = express.Router();
const multer = require('multer');

/**
 * Método que define dónde se van a guardar los archivos. 
 */

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname)
  }
})

let upload = multer({storage: storage});

/**
 * Middleware to log request information.
 * Logs the current date, HTTP method, and URL.
 */
router.use((req, res, next) => {
  console.log(new Date().toString(), "Método:", req.method);
  ", URL:", req.baseUrl;
  next();
});

/**
 * GET /
 * Retrieve a list of all physios.
 * Renders the physios list view.
 */
router.get("/", (req, res) => {
  Physio.find()
    .then((resultado) => {
      res.status(200).render("physios/physios_list", { physios: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error registrando physio" });
    });
});

/**
 * GET /edit/:id
 * Retrieve a specific physio for editing by ID.
 * Renders the physio edit view.
 */
router.get("/editar/:id", (req, res) => {
  Physio.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("physios/physio_edit", { physio: resultado });
      } else {
        res.render("error", { error: "Physio not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Physio not found" });
    });
});

/**
 * GET /:id
 * Retrieve details of a specific physio by ID.
 * Renders the physio detail view.
 */
router.get("/:id", (req, res) => {
  Physio.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("physios/physio_detail", { physio: resultado });
      } else {
        res.render("error", { error: "Physio not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Error findingphysio" });
    });
});

/**
 * DELETE /:id
 * Remove a physio by ID.
 * Redirects to the physio list.
 */
router.delete("/:id", (req, res) => {
  Physio.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error deleting physio" });
    });
});

module.exports = router;