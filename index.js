/* Carga de librerías */
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
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
app.set('view engine', 'njk');

/* Configuración de nunjucks*/
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Cargar middleware para peticiones POST y PUT
// y enrutadores
app.use(express.json()); // Debe ir antes de los enrutadores y del bootstrap.
app.use(express.urlencoded({ extended: true }));

// Método para borrar.  Librería externa.
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

/* Carga estática*/
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));

/* Cargar middleware para peticiones POST y PUT
 * y enrutadores */
app.use(express.json());
app.use('/patients', patients);
app.use('/records', records);
app.use('/physios', physios);
app.use('/login', login);


/* Puesta en marcha del servidor. Usamos variables de entorno para mayor seguridad. */
app.listen(process.env.PUERTO);
