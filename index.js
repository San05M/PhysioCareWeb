console.log("Iniciando servidor...");

const express = require('express');

const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const dotenv = require("dotenv");

const methodOverride = require('method-override');

dotenv.config();

/* Enrutadores */
const patients = require(__dirname + '/routers/patients.js');

const physios = require(__dirname + '/routers/physios.js');

const records = require(__dirname + '/routers/records.js');

const auth = require(__dirname + '/routers/auth.js');
/* Conectar con BD en Mongo */
mongoose.connect('mongodb://127.0.0.1:27017/physiocare')
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error conectando a MongoDB:", err));

/* Inicializar Express */
let app = express();

app.set('view engine', 'njk');

/* Configuración de nunjucks */
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

/* Middleware */
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

/* Carga estática */
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use('/public', express.static(__dirname + '/public'));
app.use('/patients', patients);
app.use('/records', records);
app.use('/physios', physios);
app.use('/auth', auth);

app.listen(8080, () => {
    console.log("Servidor iniciado en http://localhost:8080");
});
