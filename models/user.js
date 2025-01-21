const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [ true, "El usuario es necesario"],
        unique: true,
        minlength: [ 4, "Mínimo 4 caracteres" ],
    }, 
    password: {
        type: String,
        required: [ true, "La contrasena es obligatoria"],
        minlength: [ 7, "Mínimo 7 caracteres" ],
    },
    rol: {
        type: String,
        required: [ true, "El rol es necesario"],
        enum: ["admin", "physio", "patient"]
    }
});

let User = mongoose.model("user", userSchema);
module.exports = User; 