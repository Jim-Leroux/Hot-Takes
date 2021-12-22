// Import de Mongoose pour se connecter à la DB
const mongoose = require("mongoose");

// Import de mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

// Modèle de DB pour le signup (Inscription)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Contrôle de l'email unique via mongoose-unique-validator
userSchema.plugin(uniqueValidator);

// Export du module
module.exports = mongoose.model("User", userSchema);
