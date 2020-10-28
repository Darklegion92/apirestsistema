"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const usuarioRouter = require("./routes/Usuario.routes");
const agrupacionesRouter = require("./routes/Agrupaciones.routes");
const articulosRouter = require("./routes/Articulos.routes");
const ventasRouter = require("./routes/Ventas.routes");
const sucursalesRouter = require("./routes/Sucursales.routes");
const clientesRouter = require("./routes/Clientes.routes");
const barriosRouter = require("./routes/Barrios.routes");
const bodegasRouter = require("./routes/Bodegas.routes");
const entradasRouter = require("./routes/Entradas.routes");
const path = require("path");
const session = require("express-session");
const CONFIG = require("./config/config");
const { isAuth } = require("./middlewares/acceso");

const APP = express();

//MiddelWare
APP.use(cors());
APP.use(bodyParser.json());
APP.use(bodyParser.urlencoded({ extended: false }));
APP.use(
    session({
        secret: CONFIG.SECRET_TOKEN,
        resave: true,
        saveUninitialized: true,
    })
);
APP.use(morgan("dev"));

//Ruta
APP.use("/oauth", usuarioRouter);
APP.use("/api/usuarios", usuarioRouter);
APP.use("/agrupaciones", agrupacionesRouter);
APP.use("/api/productos", articulosRouter);
APP.use("/ventas", ventasRouter);
APP.use("/api/sucursales", sucursalesRouter);
APP.use("/api/clientes", clientesRouter);
APP.use("/api/barrios", barriosRouter);
APP.use("/api/bodegas", bodegasRouter);
APP.use("/api/entradas", entradasRouter);

//Elementos Estaticos
APP.use(express.static(path.join(__dirname, "public")));
module.exports = APP;