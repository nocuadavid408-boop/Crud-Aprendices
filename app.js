const express = require('express');
require('dotenv/config');
const app = express();
const PORT = process.env.PORT || 3000;

//libreria para leer archivos
const sistemaArchivos = require ('fs');
const ruta = require('path')
//generar una ruta para el archivo aprendices.json
const rutaArchivojson = ruta.join(__dirname,'listaDatos.json');

//------------------------
app.use(express.json());
//------------------------

//ruta raiz
app.get('/', (req, res) => {
  res.send('Servidor inicializado correctamente');
});

//endpoint para obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) =>{
    if (error){
      res.status(500).json({error: "Error al leer el archivo, conexion db"})
    }
    const listaaprendices = JSON.parse(datos);
    res.json(listaaprendices)
  })
});


//mode de escucha del servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});