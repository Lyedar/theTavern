var Immutable = require('immutable')
var Profile = require('../models/profileModel')

function suggestions(req, res) {
	console.log('Suggesting')
	const query = {
	}
	console.log('Start suggestion search')
	Profile.find(query).exec(function(err, profiles) {
		if(err) return console.log(err);
		console.log('found', profiles)
		getUser(req.params.slug).then(
			(user)=>{
				console.log('Made it past the requests')
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
		.filter(profile => user.email !== profile.email )
		.map(profile => Object.assign(profile, {availabilityScore: compareTimes(user.availability, profile.availability)}) )
		.map(profile => Object.assign(profile, {gameOverlap: userGames.intersect(profile.games).size}))
		.sort((a,b) => {
			var score 
			console.log('A is equal to ', a)
			console.log('B is equal to ', b)
			var availabiltyModifier =0;
			if (a.availabilityScore > b.availabilityScore){
				availabilityModifier = 5
			} else if (b.availabilityScore > a.availabilityScore){
				availabilityModifier = -5
			}
			var overlapModifier = a.gameOverlap - b.gameOverlap
			var locationModifier = 0
			if(user.location.toLowerCase() === a.location.toLowerCase()){
				locationModifier += 5
			}
			if(user.location.toLowerCase() === b.location.toLowerCase()){
				locationModifier -= 5
			}
			var score = availabilityModifier + overlapModifier + locationModifier
			console.log('FINAL SCORE! ', score)
			return score * -1
		})
		console.log('SORTED ARRAY: ', profiles)
		return profiles.slice(0,3)
	
}

function compareTimes(userTime, profileTime){
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	const times = ['Morning', 'Lunch', 'Afternoon', 'Night', 'GraveYard']
	const returnVal = days.map(day=> times.filter(time => userTime[day][time] && profileTime[day][time]).length)
						  .reduce((acc, next) => acc + next)
	return returnVal
}	

module.exports = {suggestions}