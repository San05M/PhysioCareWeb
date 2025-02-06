console.log("Iniciando servidor...");

const express = require('express');
console.log("prueba")
const session = require('express-session');
console.log("prueba2")
const mongoose = require('mongoose');
console.log("prueba3")
const nunjucks = require('nunjucks');
const dotenv = require("dotenv");

const methodOverride = require('method-override');

dotenv.config();
console.log("prueba")
/* Enrutadores */
const patients = require(__dirname + '/routers/patients.js');
const physios = require(__dirname + '/routers/physios.js');
const records = require(__dirname + '/routers/records.js');
const auth = require(__dirname + '/routers/auth.js');

/* Inicializar Express */
let app = express();

app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

/* Conectar con BD en Mongo */
mongoose.connect('mongodb://mymongodb:27017/physiocare');


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

app.get('/', (req, res) => {
  res.redirect('/public/index.html'); //Acceso a la página príncipal de índice
  });

app.listen(8080, () => {
    console.log("Servidor iniciado en http://localhost:8080");
});
