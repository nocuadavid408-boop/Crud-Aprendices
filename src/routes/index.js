//consola de rutas
const {Router} = require("express")
//importar enrutadores de la entida
const pruebaRouter = require("./preubaRouter")
const autenticarRouter = require("./autenticarRouter")
const enrutador = Router()

//usar enrutador
enrutador.use("/rutaPrueba", pruebaRouter)
enrutador.use("/autenticar", autenticarRouter)

module.exports = enrutador