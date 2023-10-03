const express = require("express");
const passport = require("passport");
const controllers = require("../controllers/analytics");
const router = express.Router();

//localhost:5000/api/analytics/overview
router.get(
  "/analytics",
  passport.authenticate("jwt", { session: false }),
  controllers.analytics
);
router.get(
  "/overview",
  passport.authenticate("jwt", { session: false }),
  controllers.overview
);

module.exports = router;
