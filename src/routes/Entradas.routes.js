const { Router } = require("express");
const EntradasCtrl = require("../controllers/Entradas.controller");

router = Router();
router
    .post("/", EntradasCtrl.guardar)
    .put("/:id", EntradasCtrl.actualizar);

module.exports = router;