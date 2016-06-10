module.exports = function(router, app) {
    var Utilisateur = require('../models/utilisateur');
    var Salle = require('../models/salle');
    var Sujet = require('../models/sujet');

    //Récupère tous les utilisateurs de la bdd (Pour tester)
    router.post('/utilisateurs', function(req, res) {
        console.log('Recherche utilisateurs');

        Utilisateur.find(function(err, utilisateurs) {
            if (err) {
                res.send(err);
            }  else {
                res.json(utilisateurs)
            }
            res.end();
        });
    });

    //Ajout d'une salle
    router.post('/ajouter/salle', function(req, res) {
        console.log("Ajout d'une salle");

        var salle = new Salle();
        salle.numero = req.body.num;
        salle.nom = req.body.nom;

        salle.save(function(err) {
            if (err) {
                res.json({ nope: 'Erreur lors de la création' });
            } else {
                res.json({ message: 'Salle de test créée' });
            }
            res.end();
        });
    });

    function salleExiste(numeroSalle) {//NE MARCHE PAS
        return Salle.find({"numero":numeroSalle},function(err,salles) {
            console.log("Salles reçues ->"+salles);
            console.log("Res condition ->"+(typeof salles !== 'undefined' && salles.length > 0));

            return (typeof salles !== 'undefined' && salles.length > 0);
        });
    }

    //Ajout d'un sujet
    router.post('/ajouter/sujet', function(req, res) {
        console.log("Ajout d'une salle");

        var sujet = new Sujet();      // create a new instance of the Bear model
        sujet.nom = req.body.nom;

        //Formatage du json pur les salles
        var sallesToSend = [];
        req.body.idSalles.forEach(function(element, index, array) {
            var jsonTmp = {};
            jsonTmp.numero = parseInt(element);

            sallesToSend.push(jsonTmp);
        });

        sujet.salles = sallesToSend;

        sujet.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'Sujet créé' });
            }
            res.end();
        });
    });

    //Suppression d'une salle de test
    router.delete('/salle/:salle_id', function(req, res) {
        console.log("Suppression d'une salle");

        Salle.remove({
            _id: req.params.salle_id
        }, function(err, salle) {
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted' });
        });
    });

    //Suppression d'un sujet de test
    router.delete('/sujet/:sujet_id', function(req, res) {
        console.log("Suppression d'un sujet");

        Sujet.remove({
            _id: req.params.sujet_id
        }, function(err, salle) {
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted' });
        });
    });

};