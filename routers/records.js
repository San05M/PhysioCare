const express = require("express");

let Records = require(__dirname + "/../models/record.js");
const { protegerIdPaciente, protegerRuta } = require("./../auth/auth");

let router = express.Router();

/* Obtener un listado de todos los records */
router.get("/", protegerRuta(["admin", "physio"]), (req, res) => {
  Records.find()
    .populate("patient")
    .then((resultado) => {
      if (resultado) {
        res
          .status(200) // Código. Devuelve una lista con la información de los records.
          .send({ ok: true, result: resultado });
      } else {
        res
          .status(404) // Error 404. No hay records.
          .send({ ok: false, result: "Error. No hay Records." });
      }
    })
    .catch((error) => {
      res
        .status(500) // Error 500. Mensaje indicando el error.
        .send({ ok: false, error: "Error obteniendo Records." });
    });
});

/* Servicio de listado por id de un record en específico */
router.get(
  "/:id",
  protegerRuta(["admin", "physio", "patient"]),
  protegerIdPaciente(),
  (req, res) => {
    Records.findById(req.params.id)
      .populate("patient")
      .then((resultado) => {
        if (resultado)
          res.status(200).send({
            ok: true,
            result: resultado,
          });
        // Código 200. Información del record.
        else
          res
            .status(404) // Error 404. No hay record.
            .send({ ok: false, error: "No se han encontrado Records" });
      })
      .catch((error) => {
        res
          .status(500) // Error 500. Mensaje indicando el error servidor.
          .send({ ok: false, error: error + " Error interno del sevidor." });
      });
  }
);

/* Buscar un record por nombre o apellido */
router.get("/find", protegerRuta(["admin", "physio"]), (req, res) => {
  Patient.find({ surname: req.query.surname })
    .then((resultadoId) => {
      let resultId = resultadoId.map((pat) => pat.id);
      Records.find({
        patient: { $in: resultId },
      })
        .populate("patient")
        .then((resultado) => {
          if (resultado) {
            res.status(200).send({ result: resultado });
          } else {
            res.status(404).send({
              ok: false,
              error:
                "Error. No se han obtenido expedientes con esos criterios.",
            });
          }
        });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ ok: false, error: error + " Error interno del servidor." });
    });
});

/* Se añadirá el record. */
router.post("/", protegerRuta(["admin", "physio"]), async (req, res) => {
  try {
    let record = new Records({
      patient: req.body.patient,
      medicalRecord: req.body.medicalRecord,
    });
    /* Esperamos a obtener el usuario y se le otorga una id. */
    const nuevoRecord = await record.save();
    res.status(201).send({ result: nuevoRecord });
  } catch (error) {
    res
      .status(400)
      .send({ ok: false, error: error + "Error al insertar un Records." });
  }
});

/* Para borrar un record por id. */

router.put("/:id", protegerRuta(["admin", "physio"]), async (req, res) => {
  try {
    const resultado = await Records.findOneAndDelete({
      patient: req.params.id,
    });
    if (resultado) {
      res.status(200).send({ result: resultadoId });
    } else {
      res.status(404).send({
        ok: false,
        error: "Error. El expediente no existe.",
      });
    }
  } catch (error) {
    res.status(500).send({ ok: false, error: error + "Error en el servidor." });
  }
});

module.exports = router;