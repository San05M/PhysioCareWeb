const session = require('express-session');
const User = require(__dirname + '/../models/user.js');

let atutentication = (req, res, next) => {

    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }

}

let rol =(rol) => {
    return (req, res, next) => {
        if (req.session.user.rol == rol) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

let accesId =() => {
    return (req, res, next) => {
        if (req.session.user._id == req.params.id && req.session.user.rol != 'patients') {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

module.exports = { atutentication: atutentication, rol: rol, accesId: accesId };