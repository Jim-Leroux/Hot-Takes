// Import de bcrypt pour le hash du MDP
const bcrypt = require("bcrypt");

// Import du model User.js de la DB
const User = require("../models/user_models");

// Import de jsonwebtoken
const jwt = require("jsonwebtoken");

// Import de crypto-js
const cryptoJS = require("crypto-js");

// Import de dotenv
const dotenv = require("dotenv").config();

// Enregistrement du nouvel utilisateur dans la DB
exports.signup = (req, res, next) => {
  // Chiffrage de l'email avec crypto-js
  /*const cryptedEmail = cryptoJS.HmacSHA256(
    req.body.email,
    `${process.env.MAIL_CRYPTOJS_KEY}`
  ).toString;*/
  // Hash du MDP avant envoi à la DB
  bcrypt
    .hash(req.body.password, 10) // salt = 10 Éxecution de l'algorithme de hash
    .then((hash) => {
      // Contenu enregistré dans la DB
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Envoi du contenu à la DB
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Gestion de l'authentification
exports.login = (req, res, next) => {
  // Checking de l'existence de l'utilisateur dans la DB
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Contrôle de la validité du MDP
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si le MDP est incorrect
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Si le MDP est valide, envoi de la réponse du serveur avec l'userId & le token
          res.status(200).json({
            // Chiffrage de l'userId pour la création de nouveaux objets
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.CRYPTED_TOKEN_KEY}`,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
