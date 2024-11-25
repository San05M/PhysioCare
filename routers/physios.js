const express = require("express");
const bcrypt = require("bcrypt");

let Physio = require(__dirname + "/../models/physio.js");
const { protegerRuta } = require("./../Auth/auth");
const User = require(__dirname + "/../models/user.js");

let router = express.Router();

/* Obtener un listado de todos los pacientes */
router.get("/", protegerRuta(["admin", "physio", "patient"]), (req, res) => {
  Physio.find()
    .then((resultado) => {
      if (resultado) {
        res
          .status(200) // Código. Devuelve una lista con la información de los physio.
          .send({ ok: true, result: resultado });
      } else {
        res
          .status(404) // Error 404. No hay physio.
          .send({ ok: false, result: "Error. No hay physio." });
      }
    })
    .catch((error) => {
      res
        .status(500) // Error 500. Mensaje indicando el error.
        .send({ ok: false, error: "Error obteniendo physio." });
    });
});
/* Servicio de listado por id de un paciente en específico */
router.get("/:id", protegerRuta(["admin", "physio", "patient"]), (req, res) => {
  Physio.findById(req.params.id)
    .then((resultado) => {
      if (resultado)
        res.status(200).send({
          ok: true,
          result: resultado,
        });
      // Código 200. Información del paciente.
      else
        res
          .status(404) // Error 404. No hay pacientes.
          .send({ ok: false, error: "No se han encontrado Physio" });
    })
    .catch((error) => {
      res
        .status(500) // Error 500. Mensaje indicando el error servidor.
        .send({ ok: false, error: error + " Error interno del sevidor." });
    });
});

/* Buscar un paciente por nombre o apellido */
router.get(
  "/find",
  protegerRuta(["admin", "physio", "patient"]),
  (req, res) => {
    Physio.find({
      surname: { $regex: req.query.surname, $options: "i" },
    })
      .then((resultado) => {
        if (resultado) res.status(200).send({ result: resultado });
        else
          res.status(404).send({
            ok: false,
            error: "Error. No se han obtenido Physio con esos criterios.",
          });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ ok: false, error: error + " Error interno del servidor." });
      });
  }
);

/* Se añadirá el paciente que se reciba en la petición a la colección de pacientes. */
router.post("/", protegerRuta(["admin"]), async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    /* Creación de usuario */
    let usuario = new Physio({
      login: req.body.login,
      password: hash,
      rol: "physio",
    });
    /* Esperamos a obtener el usuario y se le otorga una id. */
    const usuarioObtenido = await usuario.save();
    /* Creación del id */
    const id = usuarioObtenido._id;

    let nuevoPaciente = new Patient({
      _id: id,
      name: req.body.name,
      surname: req.body.surname,
      speciality: req.body.speciality,
      licenseNumber: req.body.licenseNumber,
    });

    const resultado = await nuevoPaciente.save();
    res.status(201).send({ result: resultado });
  } catch (error) {
    res
      .status(400)
      .send({ ok: false, error: error + "Error al insertar un physio." });
  }
});

/* Actualizar los datos a un paciente. Revisar este. */
router.put("/:id", protegerRuta(["admin"]), async (req, res) => {
  try {
    const resultado = await Physio.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        speciality: req.body.speciality,
        licenseNumber: req.body.licenseNumber,
      },
    });
    if (resultado) {
      res.status(200).send({ result: resultado });
    } else {
      res.status(400).send({
        ok: false,
        error: "Error actualizando los datos del Physio",
      });
    }
  } catch (error) {
    res.status(500).send({ ok: false, error: error + "Error en el servidor." });
  }
});

/* Para borrar un usuario por id. */

router.put("/:id", protegerRuta(["admin"]), async (req, res) => {
  try {
    await Physio.findByIdAndDelete(req.params.id).then((resultado) => {
      if (resultado) {
        User.findByIdAndDelete(req.params.id).then((resultadoId) => {
          res.status(200).send({ result: resultadoId });
        });
      } else {
        res.status(404).send({
          ok: false,
          error: "Error. El Physio no existe.",
        });
      }
    });
  } catch (error) {
    res.status(500).send({ ok: false, error: error + "Error en el servidor." });
  }
});

module.exports = router;