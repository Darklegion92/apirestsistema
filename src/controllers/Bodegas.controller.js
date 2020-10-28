const conexionMYSQL = require("../config/conexionMYSQL");

async function consultar(req, res) {
    res.setHeader("Content-Type", "application/json");

    var con = conexionMYSQL.con;
    let sql = "SELECT * FROM bodegas";
    await con.query(sql, async(err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const bodegas = [];
            await result.forEach((bodega) => {
                bodegas.push({
                    id: bodega.id,
                    idsucursal: bodega.idsucursal,
                    nombre: bodega.nombre,
                    createAt: bodega.fechacreacion,
                    predeterminada: bodega.predeterminada,
                });
            });
            res.status(200).send(bodegas);
        } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    });
}

async function consultarId(req, res) {
    res.setHeader("Content-Type", "application/json");
    const { id } = req.params;
    var con = conexionMYSQL.con;
    let sql = "SELECT * FROM bodegas where id = " + id;
    await con.query(sql, async(err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            await con.query(
                "SELECT * FROM sucursales where id=" + result[0].idsucursal,
                async(err, resul) => {
                    if (err) throw err;
                    if (resul.length > 0) {
                        res.status(200).send({
                            id: result[0].id,
                            sucursal: resul[0],
                            nombre: result[0].nombre,
                            createAt: result[0].fechacreacion,
                            predeterminada: result[0].predeterminada,
                        });
                    }
                }
            );
        } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
    });
}

async function consultarSucursal(req, res) {
    res.setHeader("Content-Type", "application/json");
    const { idsucursal } = req.params;
    var con = conexionMYSQL.con;
    let sql = "SELECT * FROM bodegas where idSucursal = " + idsucursal;
    await con.query(sql, async(err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const bodegas = [];
            await result.forEach((bodega) => {
                bodegas.push({
                    id: bodega.id,
                    idsucursal: bodega.idsucursal,
                    nombre: bodega.nombre,
                    createAt: bodega.fechacreacion,
                    predeterminada: bodega.predeterminada,
                });
            });
            res.status(200).send(bodegas);
        } else res.status(201).send([]);
    });
}

async function guardar(req, res) {
    res.setHeader("Content-Type", "application/json");
    const { nombre, sucursal, predeterminada } = req.body;
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
        "INSERT INTO bodegas(nombre,idsucursal,predeterminada,fechacreacion)VALUES('" +
        nombre +
        "'," +
        sucursal.id +
        "," +
        predeterminada +
        ",'" +
        dateString +
        "')";
    let creado = 0;
    await con.query(sql, async(err, result) => {
        if (err) throw err;

        if (result.affectedRows > 0) {
            creado = result.insertId;
        } else res.status(201).send({ res: "No Se Encotnraron Resultados" });
        if (creado > 0)
            await con.query(
                "SELECT * FROM bodegas where id=" + creado,
                async(err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        await con.query(
                            "SELECT * FROM sucursales where id=" + result[0].idsucursal,
                            async(err, resul) => {
                                if (err) throw err;
                                if (resul.length > 0) {
                                    res.status(200).send({
                                        bodega: {
                                            id: result[0].id,
                                            sucursal: resul[0],
                                            nombre: result[0].nombre,
                                            createAt: result[0].fechacreacion,
                                            predeterminada: result[0].predeterminada,
                                        },
                                    });
                                }
                            }
                        );
                    }
                }
            );
    });
}

async function actualizar(req, res) {
    res.setHeader("Content-Type", "application/json");
    const { nombre, sucursal, predeterminada } = req.body;
    const { id } = req.params;
    var con = conexionMYSQL.con;
    let sql =
        "UPDATE bodegas SET nombre = '" +
        nombre +
        "',idsucursal ='" +
        sucursal.id +
        "',predeterminada=" +
        predeterminada +
        " where id=" +
        id;
    await con.query(sql, async(err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            await con.query(
                "SELECT * FROM bodegas where id=" + id,
                async(err, result) => {
                    if (err) throw err;

                    if (result.length > 0) {
                        await con.query(
                            "SELECT * FROM sucursales where id=" + result[0].idsucursal,
                            async(err, resul) => {
                                if (err) throw err;
                                if (resul.length > 0) {
                                    res.status(200).send({
                                        bodega: {
                                            id: result[0].id,
                                            sucursal: resul[0],
                                            nombre: result[0].nombre,
                                            createAt: result[0].fechacreacion,
                                            predeterminada: result[0].predeterminada,
                                        },
                                    });
                                }
                            }
                        );
                    }
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
    consultarSucursal,
    actualizar,
    error,
};