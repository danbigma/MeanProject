const express = require("express");
const passport = require("passport");
const controllers = require("../controllers/product");
const router = express.Router();

router.post("/", controllers.createProduct);
router.get("/", controllers.getAll);
router.get("/:id", controllers.getById);
router.put("/:id", controllers.updateProduct);
router.post("/:id/variants", controllers.addVariant);
router.get("/:id/variants/:variantId", controllers.getVariantById);
router.put("/:id/variants/:variantId", controllers.updateVariant);
router.delete("/:id/variants/:variantId", controllers.deleteVariant);

module.exports = router;
