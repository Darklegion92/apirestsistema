const { Router } = require("express");
const SucursalesCtrl = require("../controllers/Sucursales.controller");

router = Router();
router
  .get("/", SucursalesCtrl.consultar)
  .get("/:id", SucursalesCtrl.consultarId)
  .put("/:id", SucursalesCtrl.actualizar)
  .post("/", SucursalesCtrl.guardar)
  .get("/*", SucursalesCtrl.error);

module.exports = router;
