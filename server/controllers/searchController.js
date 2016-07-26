var Profile = require('../models/profileModel')

function search(req, res) {
	Profile.find({player:req.body.player} || {dm: req.body.dm}, function(err, profiles) {
		if(err) return console.log(err);
		getUser(req.body.currentUser).then(
			(user)=>{
				var results = filterSearch(user, profiles, req.body.list);
				res.writeHead(200, {"Content-Type": "text/json"});
				console.log('attempting to send search results Results: ', results)
				res.end(JSON.stringy(results));		
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

function filterSearch(user, list, key) {
	switch(key) {
		case 'times':
			return {name: user.userName, key: 'times', list: list}
		case 'game':
			return {name: user.userName, key: 'game', list: list}
		case 'location':
			return {name: user.userName, key: 'location', list: list}
	}
}	

module.exports = {search}