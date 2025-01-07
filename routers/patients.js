const express = require("express");

let Patient = require(__dirname + "/../models/patient.js");

let router = express.Router();

// Ejercicio: Middleware para mostrar información de la petición recibida
router.use((req, res, next) => {
  console.log(
    new Date().toString(),
    "Método:",
    req.method,
    ", URL:",
    req.baseUrl
  );
  next();
});

/* Obtener un listado de todos los pacientes */
router.get("/", (req, res) => {
  Patient.find()
    .then((resultado) => {
      res
        .status(200)
        .render("patients/patients_list", { patients: resultado});
    })
    .catch((error) => {
      res.render("error", { error: "Error registrando libro" });
    });
});

// Buscar para editar
router.get("/editar/:id", (req, res) => {
  Patient.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("patients/patient_edit", { patient: resultado });
      } else {
        res.render("error", { error: "Paciente no encontrado" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Paciente no encontrado 2" });
    });
});

/* Servicio de listado por id de un paciente en específico */
router.get("/:id", (req, res) => {
  Patient.findById(req.params.id["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("patients/patient_detail", { patient: resultado});
      } else {
        res.render("error", { error: "Patient no encontradoboooo" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Error buscando patient" });
    });
});

/* Se añadirá el paciente que se reciba en la petición a la colección de pacientes. */
router.post("/", (req, res) => {
  let nuevoPaciente = new Libro({
    name: req.body.name,
    surname: req.body.surname,
    birthDate: new Date(req.body.birthDate),
    address: req.body.address,
    insuranceNumber: req.body.insuranceNumber,
  });
  nuevoPaciente
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error añadiendo paciente" });
    });
});

/* Actualizar los datos a un paciente. Revisar este. */
router.post("/:id", (req, res) => {
  Patient.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        birthDate: new Date(req.body.birthDate),
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber,
      },
    },
    { new: true }
  )
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error modificando paciente." });
    });
});

// Borrado
router.delete("/:id", (req, res) => {
  Patient.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error borrando patient" });
    });
});

module.exports = router;
