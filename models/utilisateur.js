var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UtilisateurSchema = new Schema({
    login : {type : String, required: true, unique: true},
    pass : {type : String, required: true, unique: false}
});

module.exports = mongoose.model('utilisateur', UtilisateurSchema, 'utilisateur');