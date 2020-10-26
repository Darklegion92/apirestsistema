const conexionMYSQL = require("../config/conexionMYSQL");

async function consultar(req, res) {
  res.setHeader("Content-Type", "application/json");

  var con = conexionMYSQL.con;
  let sql = "SELECT * FROM roles";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const roles = [];
      await result.forEach((rol) => {
        roles.push({
          id: rol.id,
          nombre: rol.nombre,
          createAt: rol.fechacreacion,
        });
      });
      res.status(200).send(roles);
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

function error(req, res) {
  res.status(404).send({ error: "Página no encontrada" });
}

module.exports = {
  consultar,
  error,
};
