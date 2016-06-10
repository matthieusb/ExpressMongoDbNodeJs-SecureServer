module.exports = function(router, app) {
    var Utilisateur = require('../models/utilisateur');
    var Salle = require('../models/salle');
    var Sujet = require('../models/sujet');
    var jwt    = require('jsonwebtoken');

    ////Appelé à chaque opération sur le router
    //router.use(function(req, res, next) {
    //    //console.log("Requête en cours : REQ -> " + req + " | RES -> " + res + " | NEXT ->" + next);
    //    console.log("You monster !");
    //    next();
    //});
    //
    //// Test de la route pour voir si ça marche (Voir http://localhost:8080/api)
    //router.get('/', function(req, res) {
    //    res.json({ message: 'THE API IS ALIVE ! ' });
    //});

    // -------------- TOKEN
    router.post('/getToken', function(req,res) {
        Utilisateur.findOne({
            login: req.body.login
        }, function(err, utilisateur) {
            if (err) throw err;

            if (!utilisateur) {
                res.json({ success: false, message: 'Obtention du token impossible, utilisateur introuvable' });
            } else if (utilisateur) {
                if (utilisateur.pass != req.body.pass) {// Mot de passe incorrect
                    res.json({ success: false, message: 'Obtention du token impossible, mot de passe incorrect' });
                } else {//Utilisateur trouvé avec bon mot de passe
                    var token = jwt.sign(utilisateur, app.get('superSecret'), {
                        expiresInDays: 2 //Expiration après 2 jours
                    });

                    // Information de retour
                    res.json({
                        success: true,
                        message: 'Token généré !',
                        token: token
                    });
                }
            }
        });
    });

    router.get('/salles', function(req, res) {
        console.log('Recherche salles');

        Salle.find(function(err, salles) {
            if (err)
                res.send(err);
            else res.json(salles)
        });
    });

    router.get('/salle/:salle_id', function(req, res) {
        console.log('Recherche salle selon id');

        Salle.findById(req.params.salle_id, function(err, salle) {
            if (err)
                res.send(err);
            else res.json(salle)
        });
    });

    router.get('/sujets', function(req, res) {
        console.log('Recherche sujets de test');

        Sujet.find(function(err, sujets) {
            if (err)
                res.send(err);
            else {
                res.json(sujets)
            }
        });
    });

    router.get('/sujet/:sujet_id', function(req, res) {
        console.log('Recherche salle selon id');

        Sujet.findById(req.params.sujet_id, function(err, sujet) {
            if (err)
                res.send(err);
            else res.json(sujet)
        });
    });


};
