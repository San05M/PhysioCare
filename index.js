/* Carga de librerías */
const express = require('express');
const mongoose = require('mongoose');

/* Enrutadores */
const patients = require(__dirname + '/routers/patients.js');

/* Conectar con BD en Mongo, variables de entorno. */
mongoose.connect('mongodb://127.0.0.1:27017/physiocare');

/* Inicializar Express */
let app = express();

/* Cargar middleware para peticiones POST y PUT
 * y enrutadores */
app.use(express.json());
app.use('/patients', patients);

/* Puesta en marcha del servidor. Usamos variables de entorno para mayor seguridad. */
app.listen(process.env.PUERTO);
