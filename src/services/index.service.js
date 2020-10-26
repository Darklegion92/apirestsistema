const jwt = require("jsonwebtoken");
const moment = require("moment");
const CONFIG = require("../config/config");

function createToken(usuario, data) {
  console.log(data);
  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.nombre,
    user_name: usuario.usuario,
    authorities: [data[0].nombre, data[1].nombre],
  };

  return {
    token: jwt.sign(payload, CONFIG.SECRET_TOKEN),
    exp: moment().add(1, "days").unix(),
    iat: moment().unix(),
  };
}

module.exports = {
  createToken,
};
