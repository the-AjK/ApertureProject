//maaperture auto-generated mongoose schema for collection 'supermarket'

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

exports.schema = new mongoose.Schema({
nome: { type: String },
prezzo: { type: Number, min: 0.01, max:350 },
offerta: { type: String },
posizione: { type: ObjectId, ref: 'positions' }
}, { collection: 'supermarket' });
