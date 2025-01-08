const express = require("express");

let { Record } = require(__dirname + "/../models/record.js");
let router = express.Router();

/* Obtener un listado de todos los records */
router.get("/", (req, res) => {
  Record.find()
    .populate("patient")
    .then((resultado) => {
      res.render("records/records_list", { records: resultado });
    })
    .catch((error) => {
      res.send("error", { error: "Error obteniendo Records." });
    });
});

/* Nuevo libro */
router.get('/new/:id', (req, res) => {
  Record.findById(req.params['id']).then(resultado => {
      res.render('records/record_add_appointment', {records: resultado});
  }).catch(error => {
      res.render('error', {error: 'Error registrando appointment'});
  });
});

/* Servicio de listado por id de un record en específico */
router.get("/:id", (req, res) => {
  Record.findById(req.params.id)
    .populate("patient")
    .then((resultado) => {
      if (resultado){
        res.render("records/record_detail", {
          record: resultado,
        });
      // Código 200. Información del record.
    } else {
      res.render("error", { error: "record no encontrado" });
    }
  })
  .catch((error) => {
    res.render("error", { error: "Error buscando record" });
  });
});

module.exports = router;
