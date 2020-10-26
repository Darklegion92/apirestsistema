const { Router } = require("express");
const RolesCtrl = require("../controllers/Roles.controller");

router = Router();
router.get("", RolesCtrl.consultar).get("/*", RolesCtrl.error);

module.exports = router;
