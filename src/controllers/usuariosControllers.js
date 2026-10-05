const jwt = require("jsonwebtoken");

//importar servicios
const ingresar = require("../service/autenticarService")
const listadoUsuarios = async (req, res) => {
    res.json({"mensaje":"listado de usuarios"})


};


module.exports = listadoUsuarios