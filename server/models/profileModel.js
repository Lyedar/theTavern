var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var times = {Morning: {type: Boolean, default: true}, Lunch: {type: Boolean, default: true}, Afternoon: {type: Boolean, default: true}, Night: {type: Boolean, default: true}, GraveYard: {type: Boolean, default: true}};

var profileSchema = new Schema({
 userName: {type: String, required: true},
 name: String,
 description: String,
 location: String,
 age: String,
 games: [],
 host: {type: Boolean, default: false},
 phone: String,
 email: String,
 alcohol: String,
 blockedUser: [],
 friends: [],
 skillLevel: String,
 party: [],
 availability: {
 	Monday:  times,
 	Tuesday: times,
 	Wednesday: times,
 	Thursday: times,
 	Friday:  times,
 	Saturday: times,
 	Sunday:  times
 },	
 dm: {type: Boolean, default: false},
 player: {type: Boolean, default: true}
})

var Profile = mongoose.model('profile', profileSchema);

module.exports = Profile