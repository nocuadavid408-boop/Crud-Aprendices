const { error } = require('console');
const express = require('express');
require('dotenv/config');

// Importaciones de librerías y módulos locales
const sistemaArchivos = require('fs');
const ruta = require('path');
const { validarNombre, validarCorreo } = require('./Validaciones/validaciones');

const app = express();
const PORT = process.env.PORT || 3000;

// Body-parser
app.use(express.json());

// Generar la ruta para el archivo JSON
const rutaArchivojson = ruta.join(__dirname, 'listaDatos.json');

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor inicializado correctamente');
});

// 1. OBTENER TODOS LOS APRENDICES
app.get('/aprendices', (req, res) => {
  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer el archivo, conexion db" });
    }
    try {
      const listaaprendices = JSON.parse(datos);
      res.json(listaaprendices);
    } catch (errorParse) {
      res.status(500).json({ error: "Error al procesar el archivo JSON" });
    }
  });
});

// 2. OBTENER UN SOLO APRENDIZ POR DNI
app.get('/aprendices/:dni', (req, res) => {
  const dni = parseInt(req.params.dni);

  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer el archivo, conexion bd" });
    }
    try {
      const listaAprendices = JSON.parse(datos);
      const aprendizEncontrado = listaAprendices.find(aprendiz => Number(aprendiz.dni) === dni);

      if (!aprendizEncontrado) {
        return res.status(404).json({ error: "Aprendiz no encontrado" });
      }

      res.json(aprendizEncontrado);
    } catch (errorParse) {
      res.status(500).json({ error: "Error al procesar el archivo JSON" });
    }
  });
});

// 3. CREAR UN APRENDIZ (Con DNI automático y Validaciones)
app.post("/aprendices", (req, res) => {
  const { nombre, correo } = req.body;

  // Validaciones
  if (!validarNombre(nombre)) {
    return res.status(400).json({ error: "El nombre debe ser un texto de más de 3 letras." });
  }

  if (!validarCorreo(correo)) {
    return res.status(400).json({ error: "El correo electrónico no tiene un formato válido." });
  }

  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer el archivo" });
    }

    try {
      const listaaprendices = JSON.parse(datos);

      // Generar DNI automático (autoincrementable)
      const nuevoDni = listaaprendices.length > 0 
        ? Math.max(...listaaprendices.map(a => Number(a.dni) || 0)) + 1 
        : 1;

      const nuevoAprendiz = {
        dni: nuevoDni,
        ...req.body
      };

      listaaprendices.push(nuevoAprendiz);

      sistemaArchivos.writeFile(rutaArchivojson, JSON.stringify(listaaprendices, null, 2), (errorEscribir) => {
        if (errorEscribir) {
          return res.status(500).json({ error: "No se puede registrar el aprendiz." });
        }
        res.status(201).json(nuevoAprendiz);
      });

    } catch (errorParse) {
      res.status(500).json({ error: "Error al procesar el archivo JSON" });
    }
  });
});

// 4. ACTUALIZAR UN APRENDIZ POR DNI
app.put("/aprendices/:dni", (req, res) => {
  const dni = parseInt(req.params.dni);
  const datoAprendiz = req.body;

  sistemaArchivos.readFile(rutaArchivojson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ error: "Error al leer el archivo" });
    }

    try {
      let listaaprendices = JSON.parse(datos);

      listaaprendices = listaaprendices.map((aprendiz) => {
        return aprendiz.dni === dni ? { ...aprendiz, ...datoAprendiz } : aprendiz;
      });

      sistemaArchivos.writeFile(rutaArchivojson, JSON.stringify(listaaprendices, null, 2), (errorEscribir) => {
        if (errorEscribir) {
          return res.status(500).json({ error: "No se puede modificar el aprendiz." });
        }
        res.json({ mensaje: "Aprendiz modificado con éxito", datoAprendiz });
      });
    } catch (errorParse) {
      res.status(500).json({ error: "Error al procesar el archivo JSON" });
    }
  });
});

// 5. ELIMINAR UN APRENDIZ POR DNI
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

// Servidor a la escucha
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});