// 1. CARGAR VARIABLES DE ENTORNO ANTES QUE CUALQUIER COSA
require('dotenv').config();

const express = require('express');
const app = express();

// 2. USAR EL PUERTO DEL .ENV O EL 3000 COMO RESPALDO (FALLBACK)
const port = process.env.PORT || 3000;

// Middleware body-parser integrado
app.use(express.json());

// Configuración para que ignore mayúsculas/minúsculas en las rutas de la URL
app.set('case sensitive routing', false);

// Base de datos local (Array de objetos con ID único)
const listaPersonas = [
    { "id": 1, "nombre": "Juan Camilo", "edad": 21, "correo": "juan.camilo@email.com", "imgPerfil": "" },
    { "id": 2, "nombre": "Maria Paula", "edad": 19, "correo": "maria.paula@email.com", "imgPerfil": "" },
    { "id": 3, "nombre": "Carlos Andres", "edad": 24, "correo": "carlos.andres@email.com", "imgPerfil": "" },
    { "id": 4, "nombre": "Juan", "edad": 19, "correo": "juan@gmail.com", "imgPerfil": "" }
];

// Regex para validación de correo electrónico
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// 1. RUTA INICIAL (READ)
// ==========================================
app.get("/", (req, res) => {
    res.send("Hola, estamos aprendiendo express con la ficha 3407184");
});

// ==========================================
// 2. LEER TODOS LOS APRENDICES (READ)
// ==========================================
app.get("/aprendices", (req, res) => {
    res.json(listaPersonas);
});

// ==========================================
// 3. LEER UN APRENDIZ POR ID (READ)
// ==========================================
app.get("/aprendices/:id", (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const aprendiz = listaPersonas.find(p => p.id === idBuscado);
    
    if (!aprendiz) {
        return res.status(404).json({ error: "Aprendiz no encontrado", mensaje: `No existe ningún registro con el ID ${idBuscado}` });
    }
    res.json(aprendiz);
});

// ==========================================
// 4. LEER UN APRENDIZ POR NOMBRE (READ)
// ==========================================
app.get("/aprendices/nombre/:nombreRecibido", (req, res) => {
    const nombreBuscado = req.params.nombreRecibido;
    const aprendizEncontrado = listaPersonas.find(
        p => p.nombre.toLowerCase() === nombreBuscado.toLowerCase()
    );
    
    if (!aprendizEncontrado) {
        return res.status(404).json({ error: "Aprendiz no encontrado", mensaje: `No se encontró a nadie llamado '${nombreBuscado}'` });
    }
    res.json(aprendizEncontrado);
});

// ==========================================
// 5. CREAR UN NUEVO APRENDIZ (CREATE)
// ==========================================
app.post("/aprendices", (req, res) => {
    const { nombre, edad, correo, imgPerfil } = req.body;
    
    if (!nombre || nombre.trim().length < 3) {
        return res.status(400).json({ error: "Validación fallida", mensaje: "El nombre es obligatorio y debe tener al menos 3 caracteres." });
    }
    
    if (!correo || !emailRegex.test(correo)) {
        return res.status(400).json({ error: "Validación fallida", mensaje: "El correo electrónico proporcionado no tiene un formato válido." });
    }
    
    const nuevoId = listaPersonas.length > 0 ? listaPersonas[listaPersonas.length - 1].id + 1 : 1;
    const nuevoAprendiz = {
        id: nuevoId,
        nombre: nombre.trim(),
        edad: parseInt(edad) || 0,
        correo: correo.trim().toLowerCase(),
        imgPerfil: imgPerfil || ""
    };
    
    listaPersonas.push(nuevoAprendiz);
    res.status(201).json({ "mensaje": "aprendiz creado exitosamente", "Datos": nuevoAprendiz });
});

// ==========================================
// 6. ACTUALIZAR UN APRENDIZ POR ID (UPDATE)
// ==========================================
app.put("/aprendices/:id", (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const indice = listaPersonas.findIndex(p => p.id === idBuscado);

    if (indice === -1) {
        return res.status(404).json({ error: "Aprendiz no encontrado", mensaje: `Imposible actualizar. No existe el ID ${idBuscado}` });
    }

    const { nombre, edad, correo, imgPerfil } = req.body;

    if (nombre && nombre.trim().length < 3) {
        return res.status(400).json({ error: "Validación fallida", mensaje: "El nombre debe tener al menos 3 caracteres." });
    }
    if (correo && !emailRegex.test(correo)) {
        return res.status(400).json({ error: "Validación fallida", mensaje: "El correo electrónico no es válido." });
    }

    listaPersonas[indice] = {
        id: idBuscado,
        nombre: nombre ? nombre.trim() : listaPersonas[indice].nombre,
        edad: edad !== undefined ? parseInt(edad) : listaPersonas[indice].edad,
        correo: correo ? correo.trim().toLowerCase() : listaPersonas[indice].correo,
        imgPerfil: imgPerfil !== undefined ? imgPerfil : listaPersonas[indice].imgPerfil
    };

    res.json({ mensaje: "Aprendiz actualizado exitosamente", Datos: listaPersonas[indice] });
});

// ==========================================
// 7. ELIMINAR UN APRENDIZ POR ID (DELETE)
// ==========================================
app.delete("/aprendices/:id", (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const indice = listaPersonas.findIndex(p => p.id === idBuscado);

    if (indice === -1) {
        return res.status(404).json({ error: "Aprendiz no encontrado", mensaje: `Imposible eliminar. No existe el ID ${idBuscado}` });
    }

    const eliminado = listaPersonas.splice(indice, 1);

    res.json({ mensaje: "Aprendiz eliminado exitosamente", Datos: eliminado[0] });
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en: http://localhost:${port}`);
});
