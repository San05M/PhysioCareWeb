const mongoose = require("mongoose");

let appointmentsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [ true, "La fecha de nacimiento es necesaria"],
  },
  physio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "physio"
  },
  diagnosis: {
    type: String,
    required: [ true, "El diagnóstico es necesario"],
    minlength: [ 10, "Mínimo 10 caracteres" ],
    maxlength: [ 500, "Máximo 500 caracteres" ],
  },
  treatment:{
    type: String,
    required: [ true, "El tratamiento es necesario"],
  },
  observations:{
    type: String, 
    maxlength: [ 500, "Máximo 500 caracteres" ],
  }
});

let recordsSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patients",
    required: true,
    unique: true
  },
  medicalRecord: {
    type: String,
    maxlength: 1000,
  },
  appointments: [appointmentsSchema]
});

let Record = mongoose.model("records", recordsSchema);
/* No es necesario el Appointment, pero lo dejo creado por si más adelante le tengo que dar utilidad. */
let Appointment = mongoose.model("appointments", appointmentsSchema);
 
module.exports = { Record, Appointment };
