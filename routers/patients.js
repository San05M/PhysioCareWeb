const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");

let Patient = require(__dirname + "/../models/patient.js");
let User = require(__dirname + "/../models/user.js");

let router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({ storage: storage });

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

router.get("/", (req, res) => {
  Patient.find()
    .then((resultado) => {
      res.render("patients/patients_list", { patients: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error registering patient" });
    });
});

router.get("/find", (req, res) => {
  Patient.find({
    surname: { $regex: req.query.surname, $options: "i" },
  })
    .then((resultado) => {
      if (resultado.length > 0)
        res.render("patients/patients_list", { patients: resultado });
      else
        res.render("error", {
          error: "No patients were found associated with the surname entered.",
        });
    })
    .catch((error) => {
      res.render("error", {
        error: "There was a problem processing the search. Please try again later.",
      });
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

router.get("/editar/:id", (req, res) => {
  Patient.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("patients/patient_edit", { patient: resultado });
      } else {
        res.render("error", { error: "Patient not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Patient not found" });
    });
});

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

router.post("/:id", upload.single("imagen"), (req, res) => {
  let newImagen = "";
  if (req.file) newImagen = req.file.filename;

  Patient.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber,
        imagen: newImagen,
      },
    },
    { new: true, runValidators: true }
  )
    .then((resultado) => {
      if (resultado) {
        res.render("patients/patient_details", { patient: resultado });
      } else {
        res.render("error", { error: "Paciente no encontrado" });
      }
    })
    .catch((error) => {
      let errores = { general: "Error adding" };

      if (error.code === 11000) {
        if (error.keyPattern.licenseNumber)
          errores.licenseNumber = "The number of insurance already exists";
      } else {
        if (error.errors.name) errores.name = error.errors.name.message;
        if (error.errors.surname)
          errores.surname = error.errors.surname.message;
        if (error.errors.specialty)
          errores.specialty = error.errors.specialty.message;
        if (error.errors.licenseNumber)
          errores.licenseNumber = error.errors.licenseNumber.message;
      }
      res.render("patients/patient_edit", {
        error: errores,
        patient: {
          id: req.params.id,
          name: req.body.name,
          surname: req.body.surname,
          birthDate: req.body.birthDate,
          address: req.body.address,
          insuranceNumber: req.body.insuranceNumber,
        },
      });
    });
});

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
