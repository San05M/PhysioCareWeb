const session = require('express-session');
const User = require(__dirname + '/../models/user.js');

let atutentication = (req, res, next) => {
    if (req.session.login) {
        next();
    } else {
        console.log(req.session.login)
        res.redirect('/auth/login');
    }
}

let rol =(rol) => {
    return (req, res, next) => {
        console.log(rol, req.session.rol)
        if (rol.some(r => r === req.session.rol)) {
            next();
        } else {
            console.log(req.session.rol, rol)
            res.redirect('/auth/login');
        }
    }
}

module.exports = { atutentication: atutentication, rol: rol };