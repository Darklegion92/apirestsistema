const conexionMYSQL = require("../config/conexionMYSQL");

async function consultar(req, res) {
  res.setHeader("Content-Type", "application/json");
  var con = conexionMYSQL.con;
  let sql = "SELECT * FROM sucursales ";
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    let datos = [];
    result.map((dato) => {
      data = {
        nombre: dato.nombre,
        id: dato.id,
        direccion: dato.direccion,
        nit: dato.nit,
        propietario: dato.propietario,
        sede: dato.sede,
        regimen: dato.regimen,
        facebook: dato.facebook,
        instagram: dato.instagram,
        geoposicion: dato.geoposicion,
        telefono: dato.telefono,
        celular1: dato.celular1,
        celular2: dato.celular2,
        numeroFactura: dato.numerofactura,
        createAt: dato.fechacreacion,
      };
      datos.push(data);
    });
    if (datos.length > 0) res.status(200).send(datos);
    else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

async function consultarId(req, res) {
  res.setHeader("Content-Type", "application/json");
  const { id } = req.params;
  var con = conexionMYSQL.con;
  let sql = "SELECT * FROM sucursales where id = " + id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const dato = {
        nombre: result[0].nombre,
        id: result[0].id,
        direccion: result[0].direccion,
        nit: result[0].nit,
        propietario: result[0].propietario,
        sede: result[0].sede,
        regimen: result[0].regimen,
        facebook: result[0].facebook,
        instagram: result[0].instagram,
        geoposicion: result[0].geoposicion,
        telefono: result[0].telefono,
        celular1: result[0].celular1,
        celular2: result[0].celular2,
        numeroFactura: result[0].numerofactura,
        createAt: result[0].fechacreacion,
      };
      res.status(200).send(dato);
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
  });
}

async function guardar(req, res) {
  res.setHeader("Content-Type", "application/json");
  const {
    nombre,
    direccion,
    nit,
    propietario,
    sede,
    regimen,
    facebook,
    instagram,
    geoposicion,
    telefono,
    celular1,
    celular2,
    numeroFactura,
  } = req.body;
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
    "INSERT INTO sucursales(nombre,direccion,nit,propietario,sede,regimen,facebook,instagram,geoposicion,telefono,celular1,celular2,numeroFactura,fechacreacion,idusuario)VALUES('" +
    nombre +
    "','" +
    direccion +
    "','" +
    nit +
    "','" +
    propietario +
    "','" +
    sede +
    "','" +
    regimen +
    "','" +
    facebook +
    "','" +
    instagram +
    "','" +
    geoposicion +
    "','" +
    telefono +
    "','" +
    celular1 +
    "','" +
    celular2 +
    "'," +
    numeroFactura +
    ",'" +
    dateString +
    "',1)";
  let creado = 0;
  await con.query(sql, async (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      creado = result.insertId;
    } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    if (creado > 0)
      await con.query(
        "SELECT * FROM sucursales where id=" + creado,
        async (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.status(200).send({
              sucursal: {
                nombre: result[0].nombre,
                id: result[0].id,
                direccion: result[0].direccion,
                nit: result[0].nit,
                propietario: result[0].propietario,
                sede: result[0].sede,
                regimen: result[0].regimen,
                facebook: result[0].facebook,
                instagram: result[0].instagram,
                geoposicion: result[0].geoposicion,
                telefono: result[0].telefono,
                celular1: result[0].celular1,
                celular2: result[0].celular2,
                numeroFactura: result[0].numerofactura,
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
  const {
    nombre,
    direccion,
    nit,
    propietario,
    sede,
    regimen,
    facebook,
    instagram,
    geoposicion,
    telefono,
    celular1,
    celular2,
    numeroFactura,
  } = req.body;
  const { id } = req.params;
  var con = conexionMYSQL.con;
  let sql =
    "UPDATE sucursales SET nombre = '" +
    nombre +
    "', direccion='" +
    direccion +
    "',nit='" +
    nit +
    "',propietario='" +
    propietario +
    "',sede='" +
    sede +
    "',regimen='" +
    regimen +
    "',facebook='" +
    facebook +
    "',instagram='" +
    instagram +
    "',geoposicion='" +
    geoposicion +
    "',telefono='" +
    telefono +
    "',celular1='" +
    celular1 +
    "',celular2='" +
    celular2 +
    "',numerofactura=" +
    numeroFactura +
    " where id=" +
    id;
  await con.query(sql, async (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      await con.query(
        "SELECT * FROM sucursales where id=" + id,
        async (err, result) => {
          if (err) throw err;

          res.status(200).send({
            sucursal: {
              nombre: result[0].nombre,
              id: result[0].id,
              direccion: result[0].direccion,
              nit: result[0].nit,
              propietario: result[0].propietario,
              sede: result[0].sede,
              regimen: result[0].regimen,
              facebook: result[0].facebook,
              instagram: result[0].instagram,
              geoposicion: result[0].geoposicion,
              telefono: result[0].telefono,
              celular1: result[0].celular1,
              celular2: result[0].celular2,
              numeroFactura: result[0].numerofactura,
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
  consultarId,
  guardar,
  actualizar,
  error,
};
