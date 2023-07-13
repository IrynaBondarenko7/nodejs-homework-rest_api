const express = require("express");

const ctrl = require("../../controllers/auth");

const { validateBody } = require("../../middelwares");

const schemas = require("../../schemas/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.regirter);

module.exports = router;
