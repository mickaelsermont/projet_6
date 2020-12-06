const Sauce = require('../models/sauce');
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersliked: new Array(),
        usersdisliked: new Array()
    });

    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce enregistrée avec succès !'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// Like / Unlike une sauce
exports.likeSauce = (req, res, next) => {
    
    // si l'utilisateur aime la sauce --> on l'ajoute au tableau usersliked
    if(req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { 
            $set: { usersLiked: req.body.userId },
            $inc: { likes: 1}
        })
        .then(() => res.status(200).json({ message: "L'utilisateur aime la sauce !"}))
        .catch((error) => res.status(400).json({ error }));
    }

    // si l'utilisateur n'aime pas la sauce --> on l'ajoute au tableau usersdisliked
    if(req.body.like < 0) {
        Sauce.updateOne({ _id: req.params.id }, {
            $set: { usersDisliked: req.body.userId },
            $inc: { dislikes: 1}
        })
        .then(() => res.status(200).json({ message: "L'utilisateur n'aime pas la sauce !"}))
        .catch((error) => res.status(400).json({ error }));
    }

    // si l'utilisateur supprime ses j'aime 
    if(req.body.like === 0) {
        var checkLike;

        // Recupere la sauce actuelle et regarde si l'utilisateur a mis un like avant
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            checkLike = sauce.usersLiked.includes(req.body.userId);

            if(checkLike) {
                // Supprime le userId dans les deux tableux par sécurité && décremente like 
                Sauce.updateOne({ _id: req.params.id }, {
                    $pullAll: { usersLiked: [req.body.userId], usersDisliked: [req.body.userId] },
                    $inc: { likes: -1 }
                })
                .then(() => res.status(200).json({ message: "L'utilisateur a supprimé son like / dislike !"}))
                .catch((error) => res.status(400).json({ error }));
            } else {
                // Supprime le userId dans les deux tableux par sécurité && décremente dislike 
                Sauce.updateOne({ _id: req.params.id }, {
                    $pullAll: { usersLiked: [req.body.userId], usersDisliked: [req.body.userId] },
                    $inc: {dislikes: -1 }
                })
                .then(() => res.status(200).json({ message: "L'utilisateur a supprimé son like / dislike !"}))
                .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
    }    
}

// Récupère une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

// Modifie une sauce
exports.modifySauce = (req, res, next) => {
    // supprime l'ancienne image si on detecte une nouvelle
    if(req.file) {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, function (error) {
                if (error) throw error;
                // si pas d'erreur, l'image est effacé avec succès !
                console.log('Image supprimée !');
            }); 
        })
        .catch(error => res.status(500).json({ error }));
    }

    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !'}))
    .catch((error) => res.status(400).json({ error }));
};

// Supprime une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

// Récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}
