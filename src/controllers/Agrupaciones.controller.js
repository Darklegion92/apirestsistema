const conexionMYSQL = require("../config/conexionMYSQL");

async function obtener(req, res) {
  res.setHeader("Content-Type", "application/json");
  var con = conexionMYSQL.con;
  const sql =
    "SELECT * FROM familias f, grupos g where f.idfamilia = g.idfamilia";
  await con.query(sql, async function (err, result) {
    if (err) throw err;
    let rest = await result.reduce((prev, current, index, arr) => {
      // Compruebo si ya existe el elemento
      let exists = prev.find((x) => {
        return x.NOMBREFAMILIA === current.nombreFamilia;
      });
      // Si no existe lo creo con un array vacío en VALOR
      if (!exists) {
        exists = {
          NOMBREFAMILIA: current.nombreFamilia,
          GRUPOS: [current.nombreGrupo],
        };
        prev.push(exists);
      } else if (current.nombreGrupo != null) {
        let grupo = current.nombreGrupo;
        exists.GRUPOS.push(grupo);
      }
      return prev;
    }, []);
    if (rest.length > 0) res.status(200).send(rest);
    else res.status(201).send({ res: "No Se Encontraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}
async function filtro(req, res) {
  res.setHeader("Content-Type", "application/json");

  var con = conexionMYSQL.con;
  const { familia, grupo } = req.params;
  let sql = "";

  if (grupo) {
    sql =
      "SELECT a.cantidadArticulo, a.idarticulo, a.nombreArticulo, a.precioArticulo, a.descuentoArticulo, f.nombreFamilia, g.nombreGrupo, m.nombreMarca " +
      "FROM articulos a, familias f, grupos g, marcas m " +
      "WHERE f.idfamilia = a.idFamilia AND g.idFamilia = f.idFamilia AND g.idgrupo = a.idGrupo AND m.idmarca = a.idMarca" +
      " AND g.nombreGrupo = '" +
      grupo.toUpperCase() +
      "' AND f.nombreFamilia= '" +
      familia.toUpperCase() +
      "'";
  } else {
    sql =
      "SELECT a.cantidadArticulo, a.idarticulo, a.nombreArticulo, a.precioArticulo, a.descuentoArticulo, f.nombreFamilia, g.nombreGrupo, m.nombreMarca " +
      "FROM articulos a, familias f, grupos g, marcas m " +
      "WHERE f.idfamilia = a.idFamilia AND g.idFamilia = f.idFamilia AND g.idgrupo = a.idGrupo AND m.idmarca = a.idMarca" +
      " AND f.nombreFamilia= '" +
      familia.toUpperCase() +
      "'";
  }
  await con.query(sql, async function (err, result) {
    if (err) throw err;
    let datos = [];
    result.map((dato) => {
      data = {
        CODIGO: dato.idarticulo,
        NOMBRE: dato.nombreArticulo,
        PRECIO: dato.precioArticulo,
        DESCUENTO: dato.descuentoArticulo,
        NOMBREMARCA: dato.nombreMarca,
        NOMBREFAMILIA: dato.nombreFamilia,
        NOMBREGRUPO: dato.nombreGrupo,
      };
      datos.push(data);
    });
    if (datos.length > 0) res.status(200).send(datos);
    else res.status(201).send({ res: "No Se Encontraron Resultados" });
    try {
      con.release();
    } catch (e) {}
  });
}

function error(req, res) {
  res.status(404).send({ error: "Página no encontrada" });
}

module.exports = {
  obtener,
  filtro,
  error,
};
