var Profile = require('../models/profileModel')

function createOne(req, res){
	console.log("Post request recieved for creating a profile")
	Profile.create(req.body, function(err, profile){
		if(err) return console.log(err);
		res.writeHead(200, {"Content-Type": "text/json"})
		res.end(JSON.stringify(profile))
	})
}


function retrieveOne(req, res) {
	console.log("Get Request Received for ", req.params.slug)
	Profile.findOne({userName:req.params.slug}, function(err, profile) {
		if(err) return console.log(err);
		res.writeHead(200, {"Content-Type": "text/json"})
		res.end(JSON.stringify(profile))
	})
}

function updateOne(req, res) {
	console.log('Update resquest for ', req.body.userName , ' with ', req.body)
	Profile.findOneAndUpdate({userName:req.body.userName}, req.body, function(err, profile) {
		if(err) return console.log(err);
		res.writeHead(200, {"Content-Type": "text/json"})
		res.end(JSON.stringify(profile))
	})
}

module.exports = { 
	retrieveOne,
	createOne,
	updateOne
	}