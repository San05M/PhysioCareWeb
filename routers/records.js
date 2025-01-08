const express = require("express");

let { Record } = require(__dirname + "/../models/record.js");
/* let Patient = require(__dirname + "/../models/patients.js"); */

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



/*  Buscar un record por nombre o apellido 
router.get("/find", (req, res) => {
  Patient.find({ surname: req.query.surname })
    .then((resultadoId) => {
      let resultId = resultadoId.map((pat) => pat.id);
      Records.find({
        patient: { $in: resultId },
      })
        .populate("patient")
        .then((resultado) => {
          if (resultado) {
            res.status(200).send({ result: resultado });
          } else {
            res.status(404).send({
              ok: false,
              error:
                "Error. No se han obtenido expedientes con esos criterios.",
            });
          }
        });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ ok: false, error: error + " Error interno del servidor." });
    });
});
*/

/* Se añadirá el record. 
router.post("/", async (req, res) => {
  try {
    let record = new Records({
      patient: req.body.patient,
      medicalRecord: req.body.medicalRecord,
    });
    /* Esperamos a obtener el usuario y se le otorga una id. 
    const nuevoRecord = await record.save();
    res.status(201).send({ result: nuevoRecord });
  } catch (error) {
    res
      .status(400)
      .send({ ok: false, error: error + "Error al insertar un Records." });
  }
});

/* Para borrar un record por id. 

router.put("/:id", async (req, res) => {
  try {
    const resultado = await Records.findOneAndDelete({
      patient: req.params.id,
    });
    if (resultado) {
      res.status(200).send({ result: resultadoId });
    } else {
      res.status(404).send({
        ok: false,
        error: "Error. El expediente no existe.",
      });
    }
  } catch (error) {
    res.status(500).send({ ok: false, error: error + "Error en el servidor." });
  }
}); */

module.exports = router;
