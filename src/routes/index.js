//consola de rutas
const {Router} = require("express")
//importar enrutadores de la entidad
const pruebaRouter = require("./preubaRouter")
const enrutador = Router()

//usar enrutador
enrutador.use("/rutaPrueba", pruebaRouter)

module.exports = enrutador