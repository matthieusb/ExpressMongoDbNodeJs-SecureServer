var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SujetSchema = new Schema({
    nom : {type : String, required: true, unique: true},
    salles : Array
});

module.exports = mongoose.model('sujet', SujetSchema, 'sujet');