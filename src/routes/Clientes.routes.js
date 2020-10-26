const { Router } = require("express");
const ClientesCtrl = require("../controllers/Clientes.controller");

router = Router();
router
  .get("/", ClientesCtrl.consultar)
  .get("/:id", ClientesCtrl.consultarId)
  .get("/filtrar/:documento", ClientesCtrl.consultarDocumento)
  .put("/:id", ClientesCtrl.actualizar)
  .post("/", ClientesCtrl.crear)
  .get("/*", ClientesCtrl.error);

module.exports = router;
