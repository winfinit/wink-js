var async = require('async');
var http = require('https');
var config = require('config-file');

var accessToken = undefined;
var winkUri = undefined;
var winkPort = undefined;

var model = {
	light_bulbs: require('./lib/model/light'),
	eggtrays: require('./lib/model/eggtray')
};

/*
	{
		host: "www.example.com",
		path: "/foo",
		headers: {},
		data: {}
	}
*/

function _http(data, callback) {
	var options = {
	  hostname: data.host || winkUri,
	  port: data.port || winkPort,
	  path: data.path,
	  //since we are listening on a custom port, we need to specify it by hand
	 // port: '1337',
	  //This is what changes the request to a POST request
	  method: data.method,
	  headers: {}
	  
	};

	if ( data.data ) {
		data.data = JSON.stringify(data.data);
		options.headers['Content-Length'] = Buffer.byteLength(data.data);
		options.headers['Content-Type'] = "application/json";
	}

	if ( accessToken !== undefined ) {
		options.headers['Authorization'] = "Bearer " + accessToken;
	}

	if ( process.env.WINK_HTTP_TRACE ) {
		console.log('http options', options);
		console.log('http data', data);
	}
	
	var str = '';
	var req = http.request(options, function(response) {

		response.on('data', function (chunk) {
	    	str += chunk;
		});

		response.on('end', function () {
		    console.log("response in http:", str);
		    var authData = JSON.parse(str);
		    callback(JSON.parse(str));
		});
	});

	if ( data.data ) {
		req.write(data.data);
	}
	
	req.end();

	req.on('error', function(e) {
  		console.error(e);
	});

}

function POST(data, callback) {
	data.method = "POST";
	_http(data, callback);
}

function PUT(data, callback) {
	data.method = "PUT";
	_http(data, callback);
}

function GET(data, callback) {
	data.method = "GET";
	_http(data, callback);
}

function DELETE(data, callback) {
	data.method = "DELETE";
	_http(data, callback);
}

var wink = {
	authenticate: function (auth_data, callback) {
		if ( accessToken === undefined ) {
			if ( auth_data.grant_type === undefined ) {
				auth_data.grant_type = "password";
			}
			POST({
				 host: winkUri,
				 path: '/oauth2/token',
				 data: auth_data
				}, function(response) {
					accessToken = response.access_token;
					callback(response);
			});
		} else {
			callback(accessToken);
		}
	},
	init: function(auth_data, callback) {
		if ( auth_data.conf !== undefined ) {
			// get data from config
			auth_data = config.load(auth_data.conf);
		}

		if ( process.env.WINK_HOST ) {
			winkUri = process.env.WINK_HOST;
		} else if ( auth_data.hostname ) {
			winkUri = auth_data.hostname;
		} else {
			winkUri = "winkapi.quirky.com";
		}

		if ( process.env.WINK_PORT ) {
			winkPort = Number(process.env.WINK_PORT);
		} else if ( auth_data.port ) {
			winkPort = Number(auth_data.port);
		} else {
			winkPort = 443;
		}

		this.authenticate(auth_data, function(data) {
			if ( callback !== undefined ) {
				callback(data);
			}
		});
		return this;
	},
	user: function(user_id) {
		if ( user_id === undefined ) {
			user_id = "me";
		}
		return {
			create: function(data, callback) {
				throw {name: "NotImplemented", message: "Not implemented yet"};
			},
			update: function(data, callback) {
				throw {name: "NotImplemented", message: "Not implemented yet"};
			},
			get: function(callback) {
				GET({
						path: "/users/" + user_id
					}, function(data) {
						if ( callback ) {
							callback(data);
						}
				});
			},
			update_password: function(id, password, callback) {
				throw {name: "NotImplemented", message: "Not implemented yet"};
			},
			linked_services: {
				get: function(callback) {
					GET({
							path: "/users/" + user_id + "/linked_services"
						}, function(data) {
							if ( callback ) {
								callback(data);
							}
						}
					);
				},
				create: function(data, callback) {
					throw {name: "NotImplemented", message: "Not implemented yet"};
				}
			},
			devices: function(device_type, callback) {
				if ( typeof device_type === 'function' ) {
					callback = device_type;
					device_type = 'wink_devices';
				}
				GET({
						path: "/users/" + user_id + "/" + device_type
					}, function(data) {
						callback(data);
				});
			},
			device: function(device_name, callback) {
				// TODO: cache response from devices
				// and if device is not found, retry all
				// devices
				wink.user(user_id).devices(function(data) {
					var name = new RegExp(device_name, 'i');
					var device = undefined;
					for( var dataIndex in data.data ) {
						if ( name.test(data.data[dataIndex].name) ) {
							device = data.data[dataIndex];
							if ( device.light_bulb_id !== undefined ) {
								model.light_bulbs(device, wink);
							} else if ( device.eggtray_id !== undefined ) {
								model.eggtrays(device, wink);
							}
							break;
						}
					}
					console.log("returning device:", device);
					callback(device);
				});
			},
			robots: {
				get: function(callback) {
					GET({
						path: "/users/" + user_id + "/robots"
					}, function(data) {
						callback(data);
					});
				},
				create: function(data, callback) {
					throw {name: "NotImplemented", message: "Not implemented yet"};
				}
			},
			scenes: {
				get: function(callback) {
					GET({
						path: "/users/" + user_id + "/scenes"
					}, function(data) {
						callback(data);
					});
				},
				create: function(data, callback) {
					throw {name: "NotImplemented", message: "Not implemented yet"};
				}
			}
		}
		
	},
	device_group: function(device_group) {
		return {
			device_id: function(device_id) {
				return {
					get: function(callback) {
						GET({
							path: "/" + device_group + "/" + device_id
						}, function(data) {
							// inflate object with available methods
							// based on a group
							if ( device_group === "light_bulbs" ) {
								model.light_bulbs(data, wink);
							} else if (device_grou === "eggtrays" ) {
								model.eggtrays(data, wink);
							}
							callback(data);
						});
					},
					update: function(data, callback) {
						PUT({
							path: "/" + device_group + "/" + device_id,
							data: data
						}, function(data) {
							callback(data);
						});
					},
					refresh: function(callback) {
						POST({
							path: "/" + device_group + "/" + device_id + "/refresh"
						}, function(data) {
							callback(data);
						});
					},
					share: {
						get: function(callback) {
							GET({
								path: "/" + device_group + "/" + device_id + "/users"
							}, function(data) {
								callback(data);
							});
						},
						create: function(user_id, callback) {
							throw {name: "NotImplemented", message: "Not implemented yet"};
						}
					},
					unshare: function(email, callback) {
						DELETE({
								path: "/" + device_group + "/" + device_id + "/users/" + email
							}, function(data) {
								callback(data);
						});
					}
				}
			}
		};
	}
}

module.exports = wink;

// async.waterfall([
// 	// authenticate first
// 	function(callback) {
// 		authenticate(function(authData) {
// 			callback(null);
// 		});
// 	},
// 	function(callback) {
// 		lights_off(494715, function() {
// 			callback(null);
// 		});
// 	}, 
// 	function(callback) {
// 		lights_on(494715, function() {
// 			callback(null);
// 		});
// 	}
// ], function(err) {
// 	console.log('done');
// })
