const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");

let Patient = require(__dirname + "/../models/patient.js");
let User = require(__dirname + "/../models/user.js");

let router = express.Router();

/**
 * Método que define dónde se van a guardar los archivos.
 */

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({ storage: storage });

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
    .then((resultado) => {
      res.render("patients/patients_list", { patients: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error registering patient" });
    });
});

router.get("/new", (req, res) => {
  Patient.find()
    .then((resultado) => {
      res.render("patients/patient_add", { patient: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error adding patient" });
    });
});

router.post("/", upload.single("imagen"), (req, res) => {
  pass = bcrypt.hashSync(req.body.password, 10);

  let newUser = new User({
    login: req.body.login,
    password: pass,
    rol: "patient",
  });

  newUser
    .save()
    .then((resultado) => {
      let id = resultado._id;

      let newPatient = new Patient({
        _id: id,
        name: req.body.name,
        surname: req.body.surname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber,
      });

      if (req.file) newPatient.imagen = req.file.filename;

      newPatient
        .save()
        .then((resultado) => {
          res.redirect(req.baseUrl);
        })
        .catch(async (error) => {
          if (id) await User.findByIdAndDelete(id);

          let errores = { general: "Error adding" };

          if (error.code === 11000) {
            if (error.keyPattern.insuranceNumber)
              errores.insuranceNumber =
                "The number of insurance already exists";
          } else {
            if (error.errors.name) errores.name = error.errors.name.message;
            if (error.errors.surname)
              errores.surname = error.errors.surname.message;
            if (error.errors.birthDate)
              errores.birthDate = error.errors.birthDate.message;
            if (error.errors.address)
              errores.address = error.errors.address.message;
            if (error.errors.insuranceNumber)
              errores.insuranceNumber = error.errors.insuranceNumber.message;
          }
          res.render("patients/patient_add", {
            error: errores,
            data: req.body,
          });
        });
    })
    .catch((error) => {
      console.log(error);
      let errores = { general: "Error adding" };
      if (error.code === 11000) {
        if (error.keyPattern.login) {
          errores.login = "The username already exists";
        }
      } else {
        if (error.errors.login) errores.login = error.errors.login.message;
        if (error.errors.password)
          errores.password = error.errors.password.message;
      }
      res.render("patients/patient_add", { error: errores, data: req.body });
    });
});
/**
 * GET /edit:id
 * Retrieve a specific patient for editing by ID.
 * Renders the patient edit view.
 */
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

/**
 * GET /:id
 * Retrieve details of a specific patient by ID.
 * Renders the patient detail view.
 */
router.get("/:id", (req, res) => {
  Patient.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("patients/patient_detail", { patient: resultado });
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
  Patient.findByIdAndDelete(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error deleting" });
    });
});

module.exports = router;
