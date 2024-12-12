/* Carga de librerías */
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


/* Enrutadores */
const patients = require(__dirname + '/routers/patients.js');
const physios = require(__dirname + '/routers/physios.js');
const records = require(__dirname + '/routers/records.js');

/* Conectar con BD en Mongo, variables de entorno. */
mongoose.connect('mongodb://127.0.0.1:27017/physiocare');

/* Inicializar Express */
let app = express();

/* Carga estática*/
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));

/* Cargar middleware para peticiones POST y PUT
 * y enrutadores */
app.use(express.json());
app.use('/patients', patients);
app.use('/records', records);
app.use('/physios', physios);


/* Puesta en marcha del servidor. Usamos variables de entorno para mayor seguridad. */
console.log(process.env.PUERTO)
app.listen(process.env.PUERTO);
