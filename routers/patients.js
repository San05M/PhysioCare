const express = require("express");
const bcrypt = require("bcrypt");

let Patient = require(__dirname + "/../models/patient.js");
const { protegerIdPaciente, protegerRuta } = require("./../auth/auth");
const User = require(__dirname + "/../models/user.js");

let router = express.Router();

/* Obtener un listado de todos los pacientes */
router.get("/", protegerRuta(["admin", "physio"]), (req, res) => {
  Patient.find()
    .then((resultado) => {
      if (resultado) {
        res
          .status(200) // Código. Devuelve una lista con la información de los pacientes.
          .send({ ok: true, result: resultado });
      } else {
        res
          .status(404) // Error 404. No hay pacientes.
          .send({ ok: false, result: "Error. No hay pacientes." });
      }
    })
    .catch((error) => {
      res
        .status(500) // Error 500. Mensaje indicando el error.
        .send({ ok: false, error: "Error obteniendo pacientes." });
    });
});


/* Buscar un paciente por nombre o apellido */
router.get("/find", protegerRuta(["admin", "physio"]), (req, res) => {
  Patient.find({
    surname: { $regex: req.query.surname, $options: "i" },
  })
  .then((resultado) => {
    if (resultado) res.status(200).send({ result: resultado });
    else
    res.status(404).send({
  ok: false,
  error: "Error. No se han obtenido pacientes con esos criterios.",
});
})
.catch((error) => {
  res
  .status(500)
  .send({ ok: false, error: error + " Error interno del servidor." });
});
});

/* Servicio de listado por id de un paciente en específico */
router.get(
  "/:id",
  protegerRuta(["admin", "physio", "patient"]),
  protegerIdPaciente(),
  (req, res) => {
    Patient.findById(req.params.id)
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
            .send({ ok: false, error: "No se han encontrado paciente" });
      })
      .catch((error) => {
        res
          .status(500) // Error 500. Mensaje indicando el error servidor.
          .send({ ok: false, error: error + " Error interno del sevidor." });
      });
  }
);

/* Se añadirá el paciente que se reciba en la petición a la colección de pacientes. */
router.post("/", protegerRuta(["admin", "physio"]), async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    /* Creación de usuario */
    let usuario = new User({
      login: req.body.login,
      password: hash,
      rol: "patient",
    });
    /* Esperamos a obtener el usuario y se le otorga una id. */
    const usuarioObtenido = await usuario.save();
    /* Creación del id */
    const id = usuarioObtenido._id;

    let nuevoPaciente = new Patient({
      _id: id,
      name: req.body.name,
      surname: req.body.surname,
      birthDate: req.body.birthDate,
      address: req.body.address,
      insuranceNumber: req.body.insuranceNumber,
    });

    const resultado = await nuevoPaciente.save();
    res.status(201).send({ result: resultado });
  } catch (error) {
    res
      .status(400)
      .send({ ok: false, error: error + "Error al insertar un paciente." });
  }
});

/* Actualizar los datos a un paciente. Revisar este. */
router.put("/:id", protegerRuta(["admin", "physio"]), async (req, res) => {
  try {
    const resultado = await Patient.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        birthDate: new Date(req.body.birthDate),
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber,
      },
    });
    if (resultado) {
      res.status(200).send({ result: resultado });
    } else {
      res.status(400).send({
        ok: false,
        error: "Error actualizando los datos del paciente",
      });
    }
  } catch (error) {
    res.status(500).send({ ok: false, error: error + "Error en el servidor." });
  }
});

/* Para borrar un usuario por id. */

router.put("/:id", protegerRuta(["admin", "physio"]), async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id).then((resultado) => {
      if (resultado) {
        User.findByIdAndDelete(req.params.id).then((resultadoId) => {
          res.status(200).send({ result: resultadoId });
        });
      } else {
        res.status(404).send({
          ok: false,
          error: "Error. El paciente no existe.",
        });
      }
    });
  } catch (error) {
    res.status(500).send({ ok: false, error: error + "Error en el servidor." });
  }
});

module.exports = router;
