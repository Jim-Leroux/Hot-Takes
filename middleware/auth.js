// Import de jsonwebtoken
const jwt = require("jsonwebtoken");

// Export de la fonction du middleware
module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le headers authorization
    const token = req.headers.authorization.split(" ")[1];

    // Déchiffrage du token
    const decodedToken = jwt.verify(token, `${process.env.CRYPTED_TOKEN_KEY}`);

    // Récupération du userId à l'intérieur du token déchiffré
    const userId = decodedToken.userId;

    // Comparaison de l'userId de la requête avec celui du token
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requête invalide !"),
    });
  }
};
