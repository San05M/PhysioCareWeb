const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { atutentication, rol } = require(__dirname + "/../utils/autentication.js");

let Physio = require(__dirname + "/../models/physio.js");
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
  console.log(new Date().toString(), "Método:", req.method);
  ", URL:", req.baseUrl;
  next();
});

router.get("/", atutentication, rol(["admin", "physio"]), (req, res) => {
  Physio.find()
    .then((resultado) => {
      res.status(200).render("physios/physios_list", { physios: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error registrando physio" });
    });
});

router.get("/find", atutentication, rol(["admin", "physio"]), (req, res) => {
  Physio.find({
    specialty: { $regex: req.query.specialty, $options: "i"},
  })
  .then((resultado) => {
    if(resultado.length > 0) res.render("physios/physios_list", { physios: resultado });
    else res.render("error", { error: "No physios were found associated with the speciality entered." });
  })
  .catch((error) => {
    res.render("error", { error: "There was a problem processing the search. Please try again later."});
  })
})

router.get("/new", atutentication, rol(["admin"]),(req, res) => {
  Physio.find()
    .then((resultado) => {
      res.render("physios/physio_add", { physio: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error adding physio" });
    });
});

router.get("/editar/:id", atutentication, rol(["admin"]),(req, res) => {
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

router.get("/:id", atutentication, rol(["admin", "physio"]), (req, res) => {
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

router.post("/", upload.single("imagen"), atutentication, rol(["admin"]), (req, res) => {
  pass = bcrypt.hashSync(req.body.password, 10);

  let newUser = new User({
    login: req.body.login,
    password: pass,
    rol: "physio",
  });

  newUser.save().then((resultado) => {
    let id = resultado._id;

    let newPhysio = new Physio({
      _id: id,
      name: req.body.name,
      surname: req.body.surname,
      specialty: req.body.specialty,
      licenseNumber: req.body.licenseNumber,
    });

    if (req.file) newPhysio.imagen = req.file.filename;

    newPhysio
      .save()
      .then((resultado) => {
        res.redirect(req.baseUrl);
      })
      .catch(async (error) => {
        if (id) await User.findByIdAndDelete(id);

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
        res.render("physios/physio_add", {
          error: errores,
          data: req.body,
        });
      })
      .catch((error) => {
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
        res.render("physios/physio_add", { error: errores, data: req.body });
      });
  });
});

router.post("/:id", upload.single("imagen"),  atutentication, rol(["admin"]),(req, res) => {
  let newImagen = "";
  if (req.file) newImagen = req.file.filename;

  Physio.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        specialty: req.body.specialty,
        licenseNumber: req.body.licenseNumber,
        imagen: newImagen,
      },
    },
    { new: true, runValidators: true }
  )
    .then((resultado) => {
      if (resultado) {
        res.render("physios/physio_detail", { physio: resultado });
      } else {
        res.render("error", { error: "Physio not found." });
      }
    })
    .catch((error) => {
      let errores = { general: "Error adding" };

      if (error.code === 11000) {
        if (error.keyPattern.licenseNumber)
          errores.licenseNumber = "The number of license already exists";
      } else {
        if (error.errors.name) errores.name = error.errors.name.message;
        if (error.errors.surname)
          errores.surname = error.errors.surname.message;
        if (error.errors.specialty)
          errores.specialty = error.errors.specialty.message;
        if (error.errors.licenseNumber)
          errores.licenseNumber = error.errors.licenseNumber.message;
      }
      res.render("physios/physio_edit", {
        error: errores,
        physio: {
          id: req.params.id,
          name: req.body.name,
          surname: req.body.surname,
          specialty: req.body.specialty,
          licenseNumber: req.body.licenseNumber,
          imagen: newImagen,
        },
      });
    });
});

router.delete("/:id", atutentication, rol(["admin"]),(req, res) => {
  Physio.findByIdAndDelete(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render("error", { error: "Error deleting physio" });
    });
});

module.exports = router;
