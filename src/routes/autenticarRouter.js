const { Router } = require("express");

const enrutador = Router();
// esta funcion la vamos a pasar al controlador
//importamos el controlador
const iniciarSesion  = require("../controllers/autenticarController")

enrutador.post("/login", iniciarSesion)

enrutador.post("/registro", (req, res) => {
    res.json({ mensaje: "ruta de registro" })
})

module.exports = enrutador;