const { Router } = require("express");
const AgrupacionesCtrl = require("../controllers/Agrupaciones.controller");

router = Router();
router
  .get("/", AgrupacionesCtrl.obtener)
  .get("/:familia", AgrupacionesCtrl.filtro)
  .get("/:familia/:grupo", AgrupacionesCtrl.filtro)

  .get("/*", AgrupacionesCtrl.error);

module.exports = router;
