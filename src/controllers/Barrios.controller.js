const conexionMYSQL = require("../config/conexionMYSQL");

async function consultar(req, res) {
  res.setHeader("Content-Type", "application/json");

  var con = conexionMYSQL.con;
  let sql = "SELECT * FROM barrios";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const barrios = [];
      await result.forEach((barrio) => {
        barrios.push({
          id: barrio.id,
          nombre: barrio.nombre,
          createAt: barrio.fechacreacion,
        });
      });
      res.status(200).send(barrios);
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
  });
}
async function consultarId(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { id } = req.params;
  var con = conexionMYSQL.con;
  let sql = "SELECT * FROM barrios where id = " + id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.status(200).send({
        id: result[0].id,
        nombre: result[0].nombre,
        createAt: result[0].fechacreacion,
      });
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
  });
}

async function guardar(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { nombre } = req.body;
  var con = conexionMYSQL.con;
  var m = new Date();
  var dateString =
    m.getUTCFullYear() +
    "/" +
    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
    "/" +
    ("0" + m.getUTCDate()).slice(-2) +
    " " +
    ("0" + m.getUTCHours()).slice(-2) +
    ":" +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + m.getUTCSeconds()).slice(-2);
  let sql =
    "INSERT INTO barrios(nombre,idusuario,fechacreacion)VALUES('" +
    nombre +
    "'," +
    1 +
    ",'" +
    dateString +
    "')";
  let creado = 0;
  await con.query(sql, async (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      creado = result.insertId;
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    if (creado > 0)
      await con.query(
        "SELECT * FROM barrios where id=" + creado,
        async (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.status(200).send({
              barrio: {
                id: result[0].id,
                nombre: result[0].nombre,
                createAt: result[0].fechacreacion,
              },
            });
          }
        }
      );
  });
}

async function actualizar(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { nombre } = req.body;
  const { id } = req.params;
  var con = conexionMYSQL.con;
  let sql = "UPDATE barrios SET nombre = '" + nombre + "' where id=" + id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      await con.query(
        "SELECT * FROM barrios where id=" + id,
        async (err, result) => {
          if (err) throw err;

          res.status(200).send({
            barrio: {
              id: result[0].id,
              nombre: result[0].nombre,
              createAt: result[0].fechacreacion,
            },
          });
        }
      );
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
  });
}

function error(req, res) {
  res.status(404).send({ error: "Página no encontrada" });
}

module.exports = {
  consultar,
  guardar,
  consultarId,
  actualizar,
  error,
};
