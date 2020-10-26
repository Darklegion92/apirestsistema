const conexionMYSQL = require("../config/conexionMYSQL");

async function consultar(req, res) {
  res.setHeader("Content-Type", "application/json");

  var con = conexionMYSQL.con;
  let sql =
    "SELECT c.*, b.nombre as nombrebarrio,b.fechacreacion as fechacreacionbarrio, u.usuario as usuario, u.nombre as nombreusuario FROM clientes c, barrios b, usuarios u where c.idbarrio = b.id and c.idusuario = u.id";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const clientes = [];
      await result.forEach((cliente) => {
        clientes.push({
          id: cliente.id,
          fecha: cliente.fechanacimiento,
          documento: cliente.documento,
          nombre: cliente.nombres,
          apellido: cliente.apellidos,
          createAt: cliente.fechacreacion,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          celular1: cliente.celular1,
          celular2: cliente.celular2,
          email: cliente.email,
          foto: cliente.foto,
          region: {
            id: cliente.idbarrio,
            nombre: cliente.nombrebarrio,
            createAt: cliente.fechacreacionbarrio,
          },
          user: {
            id: cliente.idusuario,
            username: cliente.usuario,
            nombre: cliente.nombreusuario,
          },
          facturas: [],
        });
      });
      res.status(200).send(clientes);
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

async function consultarDocumento(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { documento } = req.params;
  var con = conexionMYSQL.con;
  let sql =
    "SELECT c.*, b.nombre as nombrebarrio,b.fechacreacion as fechacreacionbarrio, u.usuario as usuario, u.nombre as nombreusuario FROM clientes c, barrios b, usuarios u where c.idbarrio = b.id and c.idusuario = u.id and c.documento like '%" +
    documento +
    "%'";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const clientes = [];
      await result.forEach((cliente) => {
        clientes.push({
          id: cliente.id,
          fecha: cliente.fechanacimiento,
          documento: cliente.documento,
          nombre: cliente.nombres,
          apellido: cliente.apellidos,
          createAt: cliente.fechacreacion,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          celular1: cliente.celular1,
          celular2: cliente.celular2,
          email: cliente.email,
          foto: cliente.foto,
          region: {
            id: cliente.idbarrio,
            nombre: cliente.nombrebarrio,
            createAt: cliente.fechacreacionbarrio,
          },
          user: {
            id: cliente.idusuario,
            username: cliente.usuario,
            nombre: cliente.nombreusuario,
          },
          facturas: [],
        });
      });
      res.status(200).send(clientes);
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

async function consultarId(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { id } = req.params;
  var con = conexionMYSQL.con;
  let sql =
    "SELECT c.*, b.nombre as nombrebarrio,b.fechacreacion as fechacreacionbarrio, u.usuario as usuario, u.nombre as nombreusuario FROM clientes c, barrios b, usuarios u where c.idbarrio = b.id and c.idusuario = u.id and c.id = " +
    id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.status(200).send({
        id: result[0].id,
        fecha: result[0].fechanacimiento,
        documento: result[0].documento,
        nombre: result[0].nombres,
        apellido: result[0].apellidos,
        createAt: result[0].fechacreacion,
        direccion: result[0].direccion,
        telefono: result[0].telefono,
        celular1: result[0].celular1,
        celular2: result[0].celular2,
        email: result[0].email,
        foto: result[0].foto,
        region: {
          id: result[0].idbarrio,
          nombre: result[0].nombrebarrio,
          createAt: result[0].fechacreacionbarrio,
        },
        user: {
          id: result[0].idusuario,
          username: result[0].usuario,
          nombre: result[0].nombreusuario,
        },
        facturas: [],
      });
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

async function crear(req, res) {
  res.setHeader("Content-Type", "application/json");
  const {
    nombre,
    apellido,
    documento,
    email,
    celular1,
    direccion,
    region,
  } = req.body;

  const idusuario = 1;

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

  var con = conexionMYSQL.con;
  let sql =
    "INSERT INTO clientes(nombres,apellidos,documento,email,celular1,direccion,idbarrio,fechacreacion,idusuario)VALUES('" +
    nombre +
    "','" +
    apellido +
    "','" +
    documento +
    "','" +
    email +
    "','" +
    celular1 +
    "','" +
    direccion +
    "'," +
    region.id +
    ",'" +
    dateString +
    "'," +
    idusuario +
    ")";

  let creado = 0;
  await con.query(sql, async (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      creado = result.insertId;
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    if (creado > 0)
      await con.query(
        "SELECT c.*, b.nombre as nombrebarrio,b.fechacreacion as fechacreacionbarrio, u.usuario as usuario, u.nombre as nombreusuario FROM clientes c, barrios b, usuarios u where c.idbarrio = b.id and c.idusuario = u.id and c.id=" +
          creado,
        async (err, result) => {
          if (err) throw err;

          res.status(200).send({
            cliente: {
              id: result[0].id,
              fecha: result[0].fechanacimiento,
              documento: result[0].documento,
              nombre: result[0].nombres,
              apellido: result[0].apellidos,
              createAt: result[0].fechacreacion,
              direccion: result[0].direccion,
              telefono: result[0].telefono,
              celular1: result[0].celular1,
              celular2: result[0].celular2,
              email: result[0].email,
              foto: result[0].foto,
              region: {
                id: result[0].idbarrio,
                nombre: result[0].nombrebarrio,
                createAt: result[0].fechacreacionbarrio,
              },
              user: {
                id: result[0].idusuario,
                username: result[0].usuario,
                nombre: result[0].nombreusuario,
              },
              facturas: [],
            },
          });
        }
      );
  });
}

async function actualizar(req, res) {
  res.setHeader("Content-Type", "application/json");
  const {
    nombre,
    apellido,
    documento,
    email,
    celular1,
    direccion,
    region,
  } = req.body;
  const { id } = req.params;

  var con = conexionMYSQL.con;
  let sql =
    "UPDATE clientes SET nombres = '" +
    nombre +
    "',apellidos = '" +
    apellido +
    "',documento = '" +
    documento +
    "',email = '" +
    email +
    "',celular1 = '" +
    celular1 +
    "',direccion  = '" +
    direccion +
    "',idbarrio  = " +
    region.id +
    " where id = " +
    id;

  let creado = 0;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      creado = id;
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    if (creado > 0)
      await con.query(
        "SELECT c.*, b.nombre as nombrebarrio,b.fechacreacion as fechacreacionbarrio, u.usuario as usuario, u.nombre as nombreusuario FROM clientes c, barrios b, usuarios u where c.idbarrio = b.id and c.idusuario = u.id and c.id=" +
          creado,
        async (err, result) => {
          if (err) throw err;

          res.status(200).send({
            cliente: {
              id: result[0].id,
              fecha: result[0].fechanacimiento,
              documento: result[0].documento,
              nombre: result[0].nombres,
              apellido: result[0].apellidos,
              createAt: result[0].fechacreacion,
              direccion: result[0].direccion,
              telefono: result[0].telefono,
              celular1: result[0].celular1,
              celular2: result[0].celular2,
              email: result[0].email,
              foto: result[0].foto,
              region: {
                id: result[0].idbarrio,
                nombre: result[0].nombrebarrio,
                createAt: result[0].fechacreacionbarrio,
              },
              user: {
                id: result[0].idusuario,
                username: result[0].usuario,
                nombre: result[0].nombreusuario,
              },
              facturas: [],
            },
          });
        }
      );

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
  consultarDocumento,
  consultarId,
  actualizar,
  crear,
  error,
};
