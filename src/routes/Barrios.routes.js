const { Router } = require("express");
const BarriosCtrl = require("../controllers/Barrios.controller");

router = Router();
router
  .get("/", BarriosCtrl.consultar)
  .get("/:id", BarriosCtrl.consultarId)
  .get("/*", BarriosCtrl.error)
  .post("/", BarriosCtrl.guardar)
  .put("/:id", BarriosCtrl.actualizar);


module.exports = router;
