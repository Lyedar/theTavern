var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var times = {Morning: {type: Boolean, default: true}, Lunch: {type: Boolean, default: true}, Afternoon: {type: Boolean, default: true}, Night: {type: Boolean, default: true}, GraveYard: {type: Boolean, default: true}};

var profileSchema = new Schema({
 userName: {type: String, required: true},
 name: {type: String, default : ''},
 description: {type: String, default: ''},
 location: {type: String, default: ''},
 age: {type: String, default: ''},
 games: [],
 host: {type: Boolean, default: false},
 phone: {type: String, default: ''},
 email: String,
 alcohol: {type: String, default: ''},
 blockedUser: [],
 friends: [],
 skillLevel: {type: String, default: ''},
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