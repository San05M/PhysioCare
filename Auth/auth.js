const jwt = require("jsonwebtoken");

const secreto = process.env.SECRET;

let generarToken = (id, login, rol) =>
  jwt.sign({ id: id, login: login, rol: rol }, secreto, {
    expiresIn: "2 hours",
  });

let validarToken = (token) => {
  try {
    let resultado = jwt.verify(token, process.env.SECRET);
    return resultado;
  } catch (error) {
    console.log(error);
  }
};

let protegerRuta = (rol) => {
  return (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
      token = token.substring(7);
      let resultado = validarToken(token);
      if (
        resultado &&
        (rol === "" || rol.some((res) => res === resultado.rol))
      ) {
        next();
      } else {
        res.status(403).send({ error: "Acceso no autorizado." });
      }
    } else {
      res.status(403).send({ error: "Acceso no autorizado." });
    }
  };
};

let protegerIdPaciente = () => {
  return (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
      token = token.substring(7);
      let result = validarToken(token);
      let idPaciente = req.params.id;

      if (result && (result.rol === "patient" && idPaciente === result.id)) {
        next();
      } else {
        res.status(403).send({ error: "Acceso no autorizado." });
      }
    } else {
      res.status(403).send({ error: "Acceso no autorizado." });
    }
  };
};

module.exports = {
  generarToken: generarToken,
  validarToken: validarToken,
  protegerRuta: protegerRuta,
  protegerIdPaciente: protegerIdPaciente,
};
