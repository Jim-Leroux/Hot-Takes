// Import d'Express
const express = require("express");

// Fonction Router()
const router = express.Router();

// Import du controller user.js
const userCtrl = require("../controllers/user_controllers");

// Import du middleware password.js
const password = require("../middleware/password");

// Import du middleware email.js
const email = require("../middleware/email");

// Endpoint signup
router.post("/signup", email, password, userCtrl.signup);

// Endpoint login
router.post("/login", userCtrl.login);

// Export du module
module.exports = router;
