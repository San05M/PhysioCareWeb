const mongoose = require("mongoose");

let physioSchema = new mongoose.Schema({
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
  specialty:{
    type: String,
    required: [ true, "La especialidad es necesaria"],
    enum: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'],
  },
  licenseNumber:{
    type: String,
    required: [ true, "La licencia es necesaria"],
    unique: true,
    match: /^[a-zA-Z0-9]{8}$/
  },
  imagen:{
    type: String
  }
});

let Physio = mongoose.model('physios', physioSchema);
module.exports = Physio;