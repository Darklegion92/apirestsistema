const conexionMYSQL = require("../config/conexionMYSQL");
const { createToken } = require("../services/index.service");

async function login(req, res) {
  res.setHeader("Content-Type", "application/json");

  const { username, password } = req.body;

  var con = conexionMYSQL.con;
  let sql =
    "SELECT * FROM usuarios where usuario='" +
    username +
    "' and password='" +
    password +
    "'";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      await con.query(
        "SELECT p.nombre FROM permisosusuario p, roles r, roles_permisosusuario rp WHERE p.id = rp.idpermisousuario and r.id = rp.idrol and r.id= " +
          result[0].idrol,
        async (err, data) => {
          if (err) throw err;
          if (data.length > 0) {
            const tokenData = createToken(result[0], data);
            res.status(200).send({
              access_token: tokenData.token,
              username: result[0].usuario,
              nombre: result[0].nombre,
              id: result[0].id,
              expires_int: tokenData.exp,
              rol: {},
            });
          }
        }
      );
    } else
      res
        .status(201)
        .send({ status: 201, res: "No Se Encotnraron Resultados" });
  });
}

async function consultar(req, res) {
  res.setHeader("Content-Type", "application/json");

  var con = conexionMYSQL.con;
  let sql = "SELECT * FROM usuarios";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      let usuarios = [];

      await result.forEach(async (usuario, i) => {
        await usuarios.push({
          username: usuario.usuario,
          nombre: usuario.nombre,
          id: usuario.id,
          idrol: usuario.idrol,
          roles: [],
          enabled: usuario.estado,
          createAt: usuario.fechacreacion,
        });
      });
      await usuarios.forEach(async (usuario, i) => {
        await con.query(
          "SELECT p.nombre FROM permisosusuario p, roles r, roles_permisosusuario rp WHERE p.id = rp.idpermisousuario and r.id = rp.idrol and r.id=" +
            usuarios[i].idrol,
          async (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
              data.forEach((data) => {
                usuarios[i].roles = [...usuarios[i].roles, data.nombre];
              });

              if (usuarios.length === i + 1) {
                res.status(200).send(usuarios);
              }
            }
          }
        );
      });
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
  let sql = "SELECT * FROM usuarios WHERE id=" + id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      let usuario = {
        username: result[0].usuario,
        nombre: result[0].nombre,
        id: result[0].id,
        idrol: result[0].idrol,
        roles: [],
        enabled: result[0].estado,
        createAt: result[0].fechacreacion,
      };
      await con.query(
        "SELECT p.nombre FROM permisosusuario p, roles r, roles_permisosusuario rp WHERE p.id = rp.idpermisousuario and r.id = rp.idrol and r.id=" +
          usuario.idrol,
        async (err, data) => {
          if (err) throw err;
          if (data.length > 0) {
            await data.forEach((data) => {
              usuario.roles = [...usuario.roles, data.nombre];
            });
            res.status(200).send(usuario);
          }
        }
      );
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

async function guardar(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { nombre, password, username, roles } = req.body;
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
    "INSERT INTO usuarios(usuario,password,nombre,idrol,fechacreacion)VALUE('" +
    username +
    "','" +
    password +
    "','" +
    nombre +
    "'," +
    roles +
    ",'" +
    dateString +
    "')";
  await con.query(sql, async (err, result) => {
    if (err)
      res.status(201).send({ status: 201, mensaje: "Usuario Ya Creado" });
    let creado = 0;
    if (result.affectedRows > 0) {
      creado = result.insertId;
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    if (creado > 0) {
      let sql = "SELECT * FROM usuarios WHERE id=" + creado;
      await con.query(sql, async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          let usuario = {
            username: result[0].usuario,
            nombre: result[0].nombre,
            id: result[0].id,
            idrol: result[0].idrol,
            roles: [],
            enabled: result[0].estado,
            createAt: result[0].fechacreacion,
          };
          await con.query(
            "SELECT p.nombre FROM permisosusuario p, roles r, roles_permisosusuario rp WHERE p.id = rp.idpermisousuario and r.id = rp.idrol and r.id=" +
              usuario.idrol,
            async (err, data) => {
              if (err) throw err;
              if (data.length > 0) {
                await data.forEach((data) => {
                  usuario.roles = [...usuario.roles, data.nombre];
                });
                res.status(200).send(usuario);
              }
            }
          );
        }
      });
    }
  });
}

async function actualizar(req, res) {
  res.setHeader("Content-Type", "application/json");

  const { nombre, password, username, roles } = req.body;
  const { id } = req.params;
  var con = conexionMYSQL.con;

  let sql = "";

  if (password) {
    sql =
      "UPDATE usuarios SET usuario = '" +
      username +
      "',nombre='" +
      nombre +
      "',idrol=" +
      roles[0].id +
      ",password='" +
      password +
      "' where id=" +
      id;
  } else {
    sql =
      "UPDATE usuarios SET usuario = '" +
      username +
      "',nombre='" +
      nombre +
      "',idrol=" +
      roles[0].id +
      " where id=" +
      id;
  }

  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      let sql2 = "SELECT * FROM usuarios WHERE id=" + id;
      await con.query(sql2, async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          let usuario = {
            username: result[0].usuario,
            nombre: result[0].nombre,
            id: result[0].id,
            idrol: result[0].idrol,
            roles: [],
            enabled: result[0].estado,
            createAt: result[0].fechacreacion,
          };
          await con.query(
            "SELECT p.nombre FROM permisosusuario p, roles r, roles_permisosusuario rp WHERE p.id = rp.idpermisousuario and r.id = rp.idrol and r.id=" +
              usuario.idrol,
            async (err, data) => {
              if (err) throw err;
              if (data.length > 0) {
                await data.forEach((data) => {
                  usuario.roles = [...usuario.roles, data.nombre];
                });
                res.status(200).send(usuario);
              }
            }
          );
        }
      });
    }
  });
}

function error(req, res) {
  res.status(404).send({ error: "Página no encontrada" });
}

module.exports = {
  login,
  consultar,
  actualizar,
  guardar,
  consultarId,
  error,
};
