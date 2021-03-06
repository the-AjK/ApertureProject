//maaperture auto-generated mongoose schema:

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
exports.teamsSchema = new mongoose.Schema({
		name: {type: String},
		number_players: {type: Number},
		coach: { type: ObjectId , ref:'coaches' },
		coach2: { type: ObjectId , ref:'coaches' },
		market: { type: ObjectId , ref:'supermarket' },
},
{collection: 'teams'},
{versionKey:false}
);

exports.coachesSchema = new mongoose.Schema({
name: { type: String },
surname: { type: String },
email: { type: String },
age: { type: Number, min: 18, max:70 }
},
{collection: 'coaches'},
{versionKey:false}
);

var supermarketSchema = new mongoose.Schema({
nome: { type: String },
prezzo: { type: Number, min: 1, max:350 },
offerta: { type: String },
posizione: { type: ObjectId }
}, 
{collection: 'supermarket'},
{versionKey:false}
);

var usersSchema = new mongoose.Schema({
	email: { 
			type: String, 
			required: true
	},
	password: {
		type: String
	}
}, 
{collection: 'users'}
);

exports.supermarketSchema = supermarketSchema;
exports.usersSchema = usersSchema;