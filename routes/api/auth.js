const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateBody, authenticate } = require("../../middelwares");

const schemas = require("../../schemas/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.regirter);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
