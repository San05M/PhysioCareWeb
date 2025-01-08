const express = require("express");

let Patient = require(__dirname + "/../models/patient.js");

let router = express.Router();

/**
 * Middleware to log request information.
 * Logs the current date, HTTP method, and URL.
 */
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

/**
 * GET /
 * Retrieve a list of all patients.
 * Renders the patients list view.
 */
router.get("/", (req, res) => {
  Patient.find()
    .then(resultado => {
      res
        .status(200)
        .render("patients/patients_list", { patients: resultado});
    })
    .catch((error) => {
      res.render("error", { error: "Error registering patient" });
    });
});

/**
 * GET /edit:id
 * Retrieve a specific patient for editing by ID.
 * Renders the patient edit view.
 */
router.get("/editar/:id", (req, res) => {
  Patient.findById(req.params["id"])
    .then(resultado => {
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

/**
 * GET /:id
 * Retrieve details of a specific patient by ID.
 * Renders the patient detail view.
 */
router.get("/:id", (req, res) => {
  Patient.findById(req.params["id"]).then(resultado => {
      if (resultado) {
        res.render("patients/patient_detail", { patient: resultado});
      } else {
        res.render("error", { error: "Patient not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Patient not found" });
    });
});

/**
 * DELETE /:id
 * Remove a patient by ID.
 * Redirects to the patient list.
 */
router.delete("/:id", (req, res) => {
  Patient.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error deleting" });
    });
});

module.exports = router;