const express = require("express");
let Physio = require(__dirname + "/../models/physio.js");

let router = express.Router();

// Ejercicio: Middleware para mostrar información de la petición recibida
router.use((req, res, next) => {
  console.log(new Date().toString(), "Método:", req.method);
  ", URL:", req.baseUrl;
  next();
});

/* Obtener un listado de todos s */
router.get("/", (req, res) => {
  Physio.find()
    .then((resultado) => {
      res.status(200).render("physios/physios_list", { physios: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error registrando physio" });
    });
});

// Buscar para editar
router.get("/editar/:id", (req, res) => {
  Physio.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("physios/physio_edit", { physio: resultado });
      } else {
        res.render("error", { error: "Physio no encontrado" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Phys no encontrado 2" });
    });
});

/* Servicio de listado por id de en específico */
router.get("/:id", (req, res) => {
  Physio.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("physios/physio_detail", { physio: resultado });
      } else {
        res.render("error", { error: "physio no encontrado" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Error buscando physio" });
    });
});

/* Se añadirá que se reciba en la petición a la coleccións. */
router.post("/", (req, res) => {
  let newPhysio = new Libro({
    name: req.body.name,
    surname: req.body.surname,
    specialty: req.body.address,
    licenseNumber: req.body.insuranceNumber,
  });
  newPhysio
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error añadiendo Phys" });
    });
});

/* Actualizar los datos a. Revisar este. */
router.post("/:id", (req, res) => {
  Physio.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        specialty: req.body.address,
        licenseNumber: req.body.insuranceNumber,
      },
    },
    { new: true }
  )
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error modificando Phys." });
    });
});

// Borrado
router.delete("/:id", (req, res) => {
  Physio.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error borrando physio" });
    });
});

module.exports = router;