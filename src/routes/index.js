//consola de rutas
const {Router} = require("express")
//importar enrutadores de la entida
const pruebaRouter = require("./preubaRouter")
const autenticarRouter = require("./autenticarRouter")
const usuariosRouters = require("./usuariosRouters")
const enrutador = Router()

//usar enrutador
enrutador.use("/rutaPrueba", pruebaRouter)
enrutador.use("/autenticar", autenticarRouter)
enrutador.use("/listado", usuariosRouters)

module.exports = enrutador