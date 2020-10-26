const conexionMYSQL = require("../config/conexionMYSQL");

async function obtener(req, res) {
  res.setHeader("Content-Type", "application/json");
  var con = conexionMYSQL.con;
  const { nombre } = req.params;
  let sql = "";

  if (nombre) {
    sql =
      "select * from productos where nombre like '%" + nombre.toUpperCase() + "%'";
  } else {
    sql = "select * from productos";
  }

  await con.query(sql, async (err, result) => {
    if (err) throw err;
    let datos = [];
    result.map((dato) => {
      data = {
        id: dato.id,
        descripcion: dato.descripcion,
        nombre: dato.nombre,
        createAt: dato.fechacreacion,
        foto: dato.img,
        codigo: dato.codigo,
      };
      datos.push(data);
    });
    if (datos.length > 0) res.status(200).send(datos);
    else res.status(201).send({ res: "No Se Encontraron Datos" });
    try {
      con.release();
    } catch (e) {}
  });
}

async function crear(req, res) {
  res.setHeader("Content-Type", "application/json");
  var con = conexionMYSQL.con;
  const { nombre, descripcion, codigo } = req.body;
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

  const sql =
    "INSERT INTO productos(nombre,codigo,descripcion,fechacreacion)value('" +
    nombre +
    "','" +
    codigo +
    "','" +
    descripcion +
    "','" +
    dateString +
    "')";
  let creado = 0;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      creado = result.insertId;
    } else res.status(201).send({ res: "Error al crear" });

    if (creado > 0) {
      await con.query(
        "SELECT * FROM productos where id = " + creado,
        async (err, result) => {
          res.status(200).send({
            producto: {
              id: result[0].id,
              descripcion: result[0].descripcion,
              nombre: result[0].nombre,
              createAt: result[0].fechacreacion,
              foto: result[0].img,
              codigo: result[0].codigo,
            },
          });
        }
      );
    }

    try {
      con.release();
    } catch (e) {}
  });
}

async function actualizar(req, res) {
  res.setHeader("Content-Type", "application/json");
  var con = conexionMYSQL.con;
  const { nombre, descripcion, codigo } = req.body;
  const { id } = req.params;

  const sql =
    "UPDATE productos SET nombre = '" +
    nombre +
    "', descripcion='" +
    descripcion +
    "',codigo='" +
    codigo +
    "' where id = " +
    id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      await con.query(
        "SELECT * FROM productos where id = " + id,
        async (err, result) => {
          res.status(200).send({
            producto: {
              id: result[0].id,
              descripcion: result[0].descripcion,
              nombre: result[0].nombre,
              createAt: result[0].fechacreacion,
              foto: result[0].img,
              codigo: result[0].codigo,
            },
          });
        }
      );
    } else res.status(201).send({ res: "Error al crear" });
  });
}

async function filtroCodigo(req, res) {
  res.setHeader("Content-Type", "application/json");
  var con = conexionMYSQL.con;
  const { codigo } = req.params;
  console.log(codigo);

  const sql = "select * from productos where id = " + codigo;

  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0)
      res.status(200).send({
        id: result[0].id,
        descripcion: result[0].descripcion,
        nombre: result[0].nombre,
        createAt: result[0].fechacreacion,
        foto: result[0].img,
        codigo: result[0].codigo,
      });
    else res.status(201).send({ res: "No Se Encontraron Datos" });
    try {
    } catch (e) {
      console.log(e);
    }
  });
}

function error(req, res) {
  res.status(404).send({ error: "Página no encontrada" });
}

module.exports = {
  obtener,
  filtroCodigo,
  actualizar,
  crear,
  error,
};
