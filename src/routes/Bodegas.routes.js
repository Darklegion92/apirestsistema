const { Router } = require("express");
const BodegasCtrl = require("../controllers/Bodegas.controller");

router = Router();
router
    .get("/", BodegasCtrl.consultar)
    .get("/:id", BodegasCtrl.consultarId)
    .get("/filtrar/:idsucursal", BodegasCtrl.consultarSucursal)
    .get("/*", BodegasCtrl.error)
    .post("/", BodegasCtrl.guardar)
    .put("/:id", BodegasCtrl.actualizar);

module.exports = router;