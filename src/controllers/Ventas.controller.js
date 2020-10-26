async function ventasFecha(req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(req.query);
  const { fecha_inicial, fecha_final } = req.query;

  const sql =
    "SELECT * FROM MOVIMIENTO_INVENTARIO_MES('" +
    fecha_inicial +
    "','" +
    fecha_final +
    "',1,'01','06')";
  await conexionFirebird(USER, PASS, async (err, con) => {
    await con.query(sql, async function (err, result) {
      if (err) throw err;
      let datos = [];
      result.map((dato) => {
        let MARCA = "SIN MARCA";
        if (dato.CODMARCA) MARCA = dato.CODMARCA.toString();
        data = {
          NOMBRE: dato.DESCRIPCION.toString(),
          CANTIDAD: dato.VENTA * -1,
          MARCA,
        };
        datos.push(data);
      });
      res.status(200).send(datos);
    });
    try {
      con.release();
    } catch (e) {}
  });
}

function error(req, res) {
  res.status(404).send({ error: "Página no encontrada" });
}

module.exports = {
  ventasFecha,
  error,
};
