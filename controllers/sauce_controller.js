// Import du model de la DB
const Sauce = require("../models/sauce_models");

// Import du module File System
const fs = require("fs");

// Export du controlleur (createSauce)
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  // Création d'une sauce
  const sauce = new Sauce({
    ...sauceObject,

    // Création de l'URL de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });

  // Envoi de l'objet dans la DB
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce crée !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Export du controlleur (getOneSauce)
exports.getOneSauce = (req, res, next) => {
  // Lecture d'une sauce via son ID
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Export du controlleur (GetAllSauce)
exports.getAllSauce = (req, res, next) => {
  // Lecture de toutes les sauces
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Export du controlleur (updateSauce)
exports.updateSauce = (req, res, next) => {
  // Suppression de l'image dans le dossier images
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {});
    })
    .catch((error) => res.status(500).json({ error }));

  // Modification de l'objet
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // Modification de l'objet dans la DB
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Export du controlleur (deleteSauce)
exports.deleteSauce = (req, res, next) => {
  // Suppression de l'image dans le dossier images
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // Suppression de l'objet dans la DB
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Export du controlleur (likeDislikeSauce)
exports.likeDislikeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 1:
      // Incrémentation de la valeur de like et enregistrement de l'ID de l'utilisateur
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: `Sauce liké !` }))
        .catch((error) => res.status(400).json({ error }));

      break;

    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          // Si l'ID de l'utisateur est enregistré décrémente la valeur de like
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: `Sauce unliké !` }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              // Si l'ID de l'utisateur est enregistré décrémente la valeur de dislike
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: `Sauce disliké !` }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    case -1:
      // Incrémentation de la valeur de dislike et enregistrement de l'ID de l'utilisateur
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
      )
        .then(() => {
          res.status(200).json({ message: `Sauce undisliké !` });
        })
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log(error);
  }
};
