const { Router } = require("express");
const VentasCtrl = require("../controllers/Ventas.controller");

router = Router();
router
  .get("/", VentasCtrl.ventasFecha)
  .get("/*", VentasCtrl.error);

module.exports = router;
