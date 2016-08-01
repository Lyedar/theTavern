var Immutable = require('immutable')
var Profile = require('../models/profileModel')

function suggestions(req, res) {
	console.log('Suggesting')
	const query = {
		player: req.body.player
	}

	Profile.find(query).exec(function(err, profiles) {
		if(err) return console.log(err);
		console.log('found', profiles)
		getUser({userName:req.params.slug} || 'Fred').then(
			(user)=>{
				var results = filterSearch(user, profiles);
				res.writeHead(200, {"Content-Type": "text/json"});
				res.end(JSON.stringify(results));		
			}
		);
	})
}

function getUser(user, callback) {
	return new Promise((resolve, reject) => {
		Profile.findOne({userName: user}, function(err, profile) {
			if(err) return reject(err);
			resolve(profile);
		})
	})
}

function filterSearch(user, profiles) {
	var userGames = new Immutable.Set(user.games)
	profiles = profiles
		.map((profile) => profile.toObject())
		.filter((profile) =>  user.email !== profile.email )
		.filter((profile)=> user.location.toLowerCase() === profile.location.toLowerCase())	
		.map((profile) => Object.assign({}, profile, {availabilityScore: compareTimes(user.availability, profile.availability)}))
		.filter((profile)=> profile.availabilityScore)	
		.filter((profile) => userGames.intersect(profile.games).size)	
}

function compareTimes(userTime, profileTime){
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	const times = ['Morning', 'Lunch', 'Afternoon', 'Night', 'GraveYard']
	const returnVal = days.map(day=> times.filter(time => userTime[day][time] && profileTime[day][time]).length)
						  .reduce((acc, next) => acc + next)
	return returnVal
}	

module.exports = {suggestions}