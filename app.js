const { error } = require('console');
const express = require('express');
require('dotenv/config');

// Importaciones de librerías y módulos locales
const sistemaArchivos = require('fs');
const ruta = require('path');
const { validarNombre, validarCorreo } = require('./Validaciones/validaciones');
const { json } = require('stream/consumers');

const app = express();
const PORT = process.env.PORT || 3000;

// Body-parser
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Endpoint json
app.post("/datosjson", (req,res)=>{
  const datosrecibidos = req.body
  //validacion si los datos son recibidos
  if (datosrecibidos){
    res.status(200).json({mensaje: "Datos recibidos correctamente"})
  }
  res.status(500).json({Mensaje: "No se recibieron datos"})
})

app.post("/formulario", (req,res)=>{
  const datos = req.body
  
  res.json({datos: datos})
})

// Servidor a la escucha
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});