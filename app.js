const { error } = require('console');
const express = require('express');
require('dotenv/config');
const app = express();
const PORT = process.env.PORT || 3000;

//body-parse
app.use(express.json());

//libreria para leer archivos
const sistemaArchivos = require ('fs');
const ruta = require('path')
//generar una ruta para el archivo aprendices.json
const rutaArchivojson = ruta.join(__dirname,'listaDatos.json');

//ruta raiz
app.get('/', (req, res) => {
  res.send('Servidor inicializado correctamente');
});

//endpoint para obtener todos los aprendices
app.get('/aprendices', (req, res) => {
  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) =>{
    if (error){
      res.status(500).json({error: "Error al leer el archivo, conexion db"})
    }
    const listaaprendices = JSON.parse(datos);
    res.json(listaaprendices)
  })
});

//endpoint para crear un aprendiz

app.post("/aprendices", (req, res) => {
  const datoAprendiz = req.body;
  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer el archivo" });
    }
    const listaaprendices = JSON.parse(datos);
    listaaprendices.push(datoAprendiz);
//adicionar al archivo  el nuevo aprendiz
    sistemaArchivos.writeFile(rutaArchivojson, JSON.stringify(listaaprendices, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ error: "No se puede registrar el aprendiz." });
      }
      res.status(201).json(datoAprendiz);
    });
  });
});

app.put("/aprendices/:dni", (req, res) => {
  const dni = parseInt(req.params.dni);
  const datoAprendiz = req.body;

  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer el archivo" });
    }

    let listaaprendices = JSON.parse(datos);

    listaaprendices = listaaprendices.map((aprendiz) => {
      return aprendiz.dni === dni ? { ...aprendiz, ...datoAprendiz } : aprendiz;
    });

    sistemaArchivos.writeFile(rutaArchivojson, JSON.stringify(listaaprendices, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ error: "No se puede registrar el aprendiz." });
      }
      res.json({ mensaje: "Aprendiz modificado con éxito", datoAprendiz });
    });
  });
});


// 4. ELIMINAR UN APRENDIZ POR DNI
app.delete('/aprendices/:dni', (req, res) => {
  const dniBusqueda = String(req.params.dni);

  sistemaArchivos.readFile(rutaArchivojson, 'utf-8', (error, datos) => {
    if (error) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }
    try {
      let listaAprendices = JSON.parse(datos);
      const existe = listaAprendices.some(aprendiz => String(aprendiz.dni) === dniBusqueda);

      if (!existe) {
        return res.status(404).json({ error: 'Aprendiz no encontrado' });
      }

      const listaFiltrada = listaAprendices.filter(aprendiz => String(aprendiz.dni) !== dniBusqueda);

      sistemaArchivos.writeFile(rutaArchivojson, JSON.stringify(listaFiltrada, null, 2), (errorEscribir) => {
        if (errorEscribir) {
          return res.status(500).json({ error: 'Error al guardar los cambios de eliminación' });
        }
        res.json({ mensaje: 'Aprendiz eliminado con éxito' });
      });
    } catch (errorParse) {
      res.status(500).json({ error: 'Error al procesar el formato de los datos' });
    }
  });
});

//mode de escucha del servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});


