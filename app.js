// Import d'Express
const express = require("express");

// Import de mongoose
const mongoose = require("mongoose");

// Import des routes
const userRoutes = require("./routes/user_routes");

const sauceRoutes = require("./routes/sauce_routes");

// Import du module path
const path = require("path");

// Import du module dotenv
const dotenv = require("dotenv").config();

// Création de l'application Express
const app = express();

// Import de mongoose pour se connecter à la DB
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB_ACCESS}:${process.env.PASSWORD_DB_ACCESS}@piquante.duess.mongodb.net/${process.env.NAME_DB_ACCESS}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Gestion des accès CORS (Cross-Origin Request Sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Conversion du body au format JSON
app.use(express.json());

// Route d'authentification
app.use("/api/auth", userRoutes);

// Route d'accès au dossier images
app.use("/images", express.static(path.join(__dirname, "images")));

// Route de publication des sauces
app.use("/api/sauces", sauceRoutes);

// Export de app.js
module.exports = app;
