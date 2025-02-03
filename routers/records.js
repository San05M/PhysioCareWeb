const express = require("express");

let { Record } = require(__dirname + "/../models/record.js");
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
      res.render("records/records_list", { records: resultado });
    })
    .catch((error) => {
      res.send("error", { error: "Error obtaining records." });
    });
});

router.get('/new/:id', (req, res) => {
  Record.findById(req.params['id']).then(resultado => {
      res.render('records/record_add_appointment', {records: resultado});
  }).catch(error => {
      res.render('error', {error: 'Error registering appointment'});
  });
});

router.get("/:id", (req, res) => {
  Record.findById(req.params.id)
    .populate("patient")
    .then((resultado) => {
      if (resultado){
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

module.exports = router;
