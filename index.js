/* Carga de librerías */
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


/* Enrutadores */
const patients = require(__dirname + '/routers/patients.js');
const physios = require(__dirname + '/routers/physios.js');
const records = require(__dirname + '/routers/records.js');
const auth = require(__dirname + '/routers/auth.js');

/* Conectar con BD en Mongo, variables de entorno. */
mongoose.connect('mongodb://127.0.0.1:27017/physiocare');

/* Inicializar Express */
let app = express();

/* Cargar middleware para peticiones POST y PUT
 * y enrutadores */
app.use(express.json());
app.use('/patients', patients);
app.use('/records', records);
app.use('/physios', physios);
app.use('/auth', auth);

/* Puesta en marcha del servidor. Usamos variables de entorno para mayor seguridad. */
console.log(process.env.PUERTO)
app.listen(process.env.PUERTO);
