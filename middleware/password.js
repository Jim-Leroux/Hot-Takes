const passwordSchema = require("../models/password_model");

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        "Le MDP doit contenir au moins 5 caractères dont une majuscule, une minuscule et un chiffre minimum.",
    });
  } else {
    next();
  }
};
