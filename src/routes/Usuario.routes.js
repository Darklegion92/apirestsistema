const { Router } = require("express");
const UsuariosCtrl = require("../controllers/Usuarios.controller");
const RolesCtrl = require("../controllers/Roles.controller");

router = Router();
router
  .post("/token", UsuariosCtrl.login)
  .post("/", UsuariosCtrl.guardar)
  .put("/:id",UsuariosCtrl.actualizar)
  .get("/roles", RolesCtrl.consultar)
  .get("/:id", UsuariosCtrl.consultarId)
  .get("/", UsuariosCtrl.consultar)
  .get("/*", UsuariosCtrl.error);

module.exports = router;
