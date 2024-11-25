const express = require("express");
const bcrypt = require("bcrypt");

const auth = require("./../Auth/auth");
const User = require(__dirname + "/../models/user.js");

let router = express.Router();

router.post("/login", async (req, res) => {
  let login = req.body.login;

  const password = req.body.password;
  User.find()
    .then((result) => {
      if (result) {
        let exist = result.filter((u) => u.login == login);

        if (
          exist.length === 1 &&
          bcrypt.compareSync(password, exist[0].password)
        ) {
          res
            .status(200)
            .send({
              result: auth.generarToken(
                exist[0]._id,
                exist[0].login,
                exist[0].rol
              ),
            });
        } else {
          res.status(401).send({ ok: false, error: "Login incorrecto" });
        }
      }
    })
    .catch(() => {
      /* No pedido pero recogido por si acaso. */
      res.status(500).send({ ok: false, error: "Error en el login" });
    });
});

module.exports = router;
