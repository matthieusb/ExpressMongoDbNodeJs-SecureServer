var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SalleSchema = new Schema({
    numero : {type : Number, required: true, unique: true},
    nom : String
});

module.exports = mongoose.model('salle', SalleSchema, 'salle');