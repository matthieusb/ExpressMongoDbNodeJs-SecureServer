// server.js

// ------------------------------
// ---- INCLUSIONS SERVEUR
// ------------------------------
var express    = require('express');
var app        = express();
var appSecure        = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var jwt = require('jsonwebtoken');

var https = require('https');
var http = require('http');
var fs = require('fs');

var config = require('./config');
var user = require('./models/utilisateur');

//Configuration du body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(morgan('dev'));//Pour logguer avec morgan

appSecure.use(bodyParser.urlencoded({ extended: true }));
appSecure.use(bodyParser.json());
//appSecure.use(morgan('dev'));//Pour logguer avec morgan

//var port = process.env.PORT || 8080; // Le port de l'application

// ------------------------------
// ---- MONGODB
// ------------------------------
mongoose.connect(config.database);
app.set('superSecret', config.secret);
appSecure.set('superSecret', config.secret);

// ------------------------------
// ---- Redirection HTTPS obligatoire
// ------------------------------
var domain = 'localhost';

app.get('*', function(req, res){
    // redirect to HTTPS
    console.log('https://' + domain + ":8443" + req.path);
    res.redirect('https://' + domain + ":8443" + req.path);
});

var options = {
    key: fs.readFileSync('ssl-key.pem'),
    cert: fs.readFileSync('ssl-cert.pem')
};

// ------------------------------
// ---- VUE JADE
// ------------------------------
appSecure.set('view engine', 'jade');

appSecure.get('/', function (req, res) {
    res.render('index', { title: 'Aperture Science', message: 'Titre'});
});

// ------------------------------
// ---- ROUTES
// ------------------------------

// Paramètres --------------------
var router = express.Router(); //Routeur express
require("./controllers/apiRest")(router,appSecure);

//Ajout du répertoire public comme préfixe pour les inclusions
appSecure.use(express.static(__dirname + '/public'));

// Liste des routes pour l'API --------------------
appSecure.use("/api", router);

// Interception du token--------------------
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var tokenRequete = req.body.token || req.query.token || req.headers['x-access-token'];

    if (tokenRequete) {
        // Verification du token via jwt
        jwt.verify(tokenRequete, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {// On sauvegarde la requête pour d'autres routes si tout est ok
                req.decoded = decoded;
                next();
            }
        });

    } else {//Si aucun token trouvé dans la requête, on renvoie une erreur
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

require("./controllers/apiRestTokenProtected")(router,app);//Inclusion des routes de l'api qui SONT protégées
require("./controllers/apiRestTokenProtected")(router,appSecure);//Inclusion des routes de l'api qui SONT protégées
// ------------------------------
// ---- LANCEMENT SERVEUR
// ------------------------------
//app.listen(port);

http.createServer(app).listen(8080, function(){
    console.log('HTTP listening on port 8080');
});

https.createServer(options, appSecure).listen(8443, function(){
    console.log('HTTPS listening on port 8443');
});

//console.log('Oh hello, you again on port ' + port);

