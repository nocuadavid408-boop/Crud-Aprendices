//creamos las funciones para utilizar en el router
const jwtoken = require("jsonwebtoken")
//importar servicio
const ingresar = require("../services/autenticarService")
const   iniciarSesion = (req, res) =>{
    const {usuario, clave} = req.body
    const token = ingresar(usuario, clave)
    res.json({token})
    // try{
    // } catch(error){
    // }
}

module.exports = iniciarSesion