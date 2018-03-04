var users = require('../data/users.json');

exports.new = function(req, res) {
    var userName = req.body.userName;

    users[userName] = {
		"firstName": "Guest","lastName": "Person",
		"majors": [],"minors": [],"college": "",
		"schedules": [{
				"name": "My Schedule",
                "years": [{"name": "year1","terms": [{
								"id": "f","courses": []},{
								"id": "w","courses": []},{
								"id": "s","courses": []},{
								"id": "s1","courses": []},{
								"id": "s2","courses": []}
						]},{"name": "year2","terms": [{
								"id": "f","courses": []},{
								"id": "w","courses": []},{
								"id": "s","courses": []},{
								"id": "s1","courses": []},{
								"id": "s2","courses": []}
						]},{"name": "year3","terms": [{
								"id": "f","courses": []},{
								"id": "w","courses": []},{
								"id": "s","courses": []},{
								"id": "s1","courses": []},{
								"id": "s2","courses": []}
						]},{"name": "year4","terms": [{
								"id": "f","courses": []},{
								"id": "w","courses": []},{
								"id": "s","courses": []},{
								"id": "s1","courses": []},{
								"id": "s2","courses": []}
						]}]}]}

    console.log("user "+userName+" initialized");
    res.send("success!");
};
