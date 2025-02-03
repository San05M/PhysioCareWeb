const express = require("express");

let { Record } = require(__dirname + "/../models/record.js");
let Patient = require(__dirname + "/../models/patient.js");
let Physio = require(__dirname + "/../models/physio.js");
let router = express.Router();

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
  Record.find()
    .populate("patient")
    .then((resultado) => {
      if (resultado.length > 0)
        res.render("records/records_list", { records: resultado });
      else res.render("error", { error: "No records were found." });
    })
    .catch((error) => {
      res.send("error", { error: "Error obtaining records." });
    });
});

router.get("/find", (req, res) => {
  console.log(Patient);
  Patient.find({
    surname: { $regex: req.query.surname, $options: "i" },
  })
    .then((resultado) => {
      let id = resultado.map((patient) => patient._id);
      Record.find({
        patient: { $in: id },
      })
        .populate("patient")
        .then((resultado) => {
          if (resultado.length > 0)
            res.render("records/records_list", { records: resultado });
          else
            res.render("error", {
              error:
                "No records were found associated with the surname entered.",
            });
        });
    })
    .catch((error) => {
      res.render("error", {
        error:
          "There was a problem processing the search. Please try again later.",
      });
    });
});

router.get("/new", (req, res) => {
  Record.findById(req.params["id"])
    .then((resultado) => {
      res.render("records/record_add", { records: resultado });
    })
    .catch((error) => {
      res.render("error", { error: "Error registering appointment" });
    });
});

router.get("/appointments/new/:id", (req, res) => {
 res.render("records/record_add_appointment", {id: req.params.id});
});

router.get("/:id", (req, res) => {
  Record.findById(req.params.id)
    .populate("patient")
    .then((resultado) => {
      if (resultado) {
        res.render("records/record_detail", {
          record: resultado,
        });
      } else {
        res.render("error", { error: "Record not found" });
      }
    })
    .catch((error) => {
      res.render("error", { error: "Error finding record" });
    });
});

router.post("/", (req, res) => {
  Patient.findOne({ insuranceNumber: req.body.insuranceNumber })
    .then((resultado) => {
      console.log(resultado);
      console.log(req.body);
      if (resultado) {
        let newRecord = new Record({
          patient: resultado._id,
          medicalRecord: req.body.medicalRecord,
        });
        newRecord
          .save()
          .then((resultado) => res.redirect(req.baseUrl))
          .catch((error) =>
            res.render("error", { error: "Error adding record" })
          );
      } else{
        res.render("error", { error: "Patient not found" });
      } 

    })
    .catch((error) => res.render("error", { error: "Record not found" }));
});

router.post("/appointments/new/:id", (req, res) => {
  Physio.findOne({licenseNumber: req.body.licenseNumber})
    .then((resultado) => {
      if (resultado) {
        Record.findById(req.params.id)
          .then((resultado) => {
            if (resultado) {
              let newAppointment = {
                date: req.body.date,
                physio: resultado._id,
                diagnosis: req.body.diagnosis,
                treatment: req.body.treatment,
                observations: req.body.observations
              };
              console.log(newAppointment);
              console.log(resultado)
              resultado.appointments.push(newAppointment);
              resultado
                .save()
                .then((resultado) => res.redirect(req.baseUrl))
                .catch((error) => res.render("error", {error: "Error adding appointment"}));
            } else {
              res.render("error", {error: "Record not found"});
            }
          })
          .catch((error) => res.render("error", {error: "Record not found"}));
      } else {
        res.render("error", {error: "Physio not found"});
      }
    })
    .catch((error) => res.render("error", {error: "Physio not found"}));
});


module.exports = router;