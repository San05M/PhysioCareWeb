console.log("Iniciando servidor...");

const express = require('express');
console.log("Express cargado");

const mongoose = require('mongoose');
console.log("Mongoose cargado");

const nunjucks = require('nunjucks');
console.log("Nunjucks cargado");

const dotenv = require("dotenv");
console.log("Dotenv cargado");

const methodOverride = require('method-override');
console.log("Method Override cargado");

dotenv.config();
console.log("Variables de entorno cargadas");

/* Enrutadores */
const patients = require(__dirname + '/routers/patients.js');
console.log("Enrutador de patients cargado");

const physios = require(__dirname + '/routers/physios.js');
console.log("Enrutador de physios cargado");

const records = require(__dirname + '/routers/records.js');
console.log("Enrutador de records cargado");

/* Conectar con BD en Mongo */
mongoose.connect('mongodb://127.0.0.1:27017/physiocare')
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error conectando a MongoDB:", err));

/* Inicializar Express */
let app = express();
console.log("Express inicializado");

app.set('view engine', 'njk');

/* Configuración de nunjucks */
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
console.log("Nunjucks configurado");

/* Middleware */
app.use(express.json());
console.log("Middleware JSON cargado");

app.use(express.urlencoded({ extended: true }));
console.log("Middleware URL-encoded cargado");

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
console.log("Method Override configurado");

/* Carga estática */
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
console.log("Bootstrap cargado");

app.use('/public', express.static(__dirname + '/public'));
console.log("Archivos estáticos cargados");

/* Cargar enrutadores */
app.use('/patients', patients);
console.log("Ruta '/patients' cargada");

app.use('/records', records);
console.log("Ruta '/records' cargada");

app.use('/physios', physios);
console.log("Ruta '/physios' cargada");

/* Iniciar servidor */
app.listen(8080, () => {
    console.log("Servidor iniciado en http://localhost:8080");
});
