const express = require("express");

const {
  regirter,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");

const { validateBody, authenticate, upload } = require("../../middelwares");

const schemas = require("../../schemas/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), regirter);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", validateBody(schemas.emailSchema), resendVerifyEmail);
router.post("/login", validateBody(schemas.loginSchema), login);
router.get("/current", authenticate, getCurrent);
router.post("/logout", authenticate, logout);
router.patch(
  "/user",
  authenticate,
  validateBody(schemas.updateSubscription),
  updateSubscription
);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
