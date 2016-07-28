var Immutable = require('immutable')
var Profile = require('../models/profileModel')

function search(req, res) {
	console.log('Searching')
	const query = {
		player: req.body.player
	}

	Profile.find(query).exec(function(err, profiles) {
		if(err) return console.log(err);
		console.log('found', profiles)
		getUser(req.body.currentUser || 'Fred').then(
			(user)=>{
				console.log('getting user', user, req.body.list)
				var results = filterSearch(user, profiles, req.body.list);
				res.writeHead(200, {"Content-Type": "text/json"});
				console.log('attempting to send search results Results: ', results)
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

function filterSearch(user, profiles, key) {
	console.log('filter search', profiles)

	const spy = (x) => {
		console.log('spying', x)
		return x
	}
	profiles = profiles
					.map(spy)
					.map(profile => profile.toObject())
					.map(spy)
					.filter((profile) =>  user.email !== profile.email )

	console.log('PROFILES',profiles)				
	switch(key) {
		case 'times':
			return profiles
			.map(profile => Object.assign({}, profile, {availabilityScore: compareTimes(user.availability, profile.availability)}))
			.filter((profile)=> profile.availabilityScore)
		case 'game':
			var userGames = new Immutable.Set(user.games)
			return profiles.filter(profile => userGames.intersect(profile.games).size)
		case 'location':
			return profiles.filter((profile)=> user.location.toLowerCase() === profile.location.toLowerCase())		
	}
}

function compareTimes(userTime, profileTime){
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	const times = ['Morning', 'Lunch', 'Afternoon', 'Night', 'GraveYard']
	const returnVal = days.map(day=> times.filter(time => userTime[day][time] && profileTime[day][time]).length)
						  .reduce((acc, next) => acc + next)
	return returnVal
}	

module.exports = {search}