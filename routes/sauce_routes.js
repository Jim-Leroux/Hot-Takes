// Import d'Express
const express = require("express");

// Fonction Router()
const router = express.Router();

// Import du middleware d'authentification
const auth = require("../middleware/auth");

// Import de Multer
const multer = require("../middleware/multer-config");

// Import du controller sauce.js
const sauceCtrl = require("../controllers/sauce_controller");

// Endpoint POST #Create
router.post("/", auth, multer, sauceCtrl.createSauce);

// Endpoint GET #Read
router.get("/", auth, sauceCtrl.getAllSauce);

router.get("/:id", auth, sauceCtrl.getOneSauce);

// Endpoint PUT #Update
router.put("/:id", auth, multer, sauceCtrl.updateSauce);

// Endpoint DELETE #Delete
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Endpoint POST #Like
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

// Export du module

module.exports = router;
