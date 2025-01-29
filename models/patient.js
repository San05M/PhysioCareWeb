const mongoose = require("mongoose");

let patientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, "El nombre es necesario"],
    minlength: [ 2, "Mínimo 2 caracteres" ],
    maxlength: [ 50, "Máximo 50 caracteres" ],
  },
  surname: {
    type: String,
    required: [ true, "El nombre es necesario"],
    minlength: [ 2, "Mínimo 2 caracteres" ],
    maxlength: [ 50, "Máximo 50 caracteres" ],
  },
  birthDate: {
    type: Date,
    required: [ true, "La fecha de nacimiento es necesaria"],
  },
  address:{
    type: String,
    required: [ true, "La dirección es necesaria"],
    maxlength: [ 100, "Máximo 100 caracteres" ],
  },
  insuranceNumber:{
    type: String,
    required: [ true, "El número es obligatorio"],
    unique: true,
    match: /^[a-zA-Z0-9]{9}$/
  }, 
  imagen:{
    type: String
  }
});

let Patient = mongoose.model('patients', patientsSchema);

module.exports = Patient;