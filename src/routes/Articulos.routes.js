const { Router } = require("express");
const ArticulosCtrl = require("../controllers/Articulos.controller");

router = Router();
router
  .get("/", ArticulosCtrl.obtener)
  .get("/filtrar-productos/:nombre", ArticulosCtrl.obtener)
  .get("/:codigo", ArticulosCtrl.filtroCodigo)
  .put("/:id", ArticulosCtrl.actualizar)
  .post("/", ArticulosCtrl.crear)
  .get("/*", ArticulosCtrl.error);

module.exports = router;
