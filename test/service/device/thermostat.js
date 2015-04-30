var expect = require('chai').expect;
var wink = require('../../../index');
var device;

describe("Wink devices", function() {

	before(function(done) {
		wink.init({
			conf: process.env.WINK_CONF || '.wink_auth.json'
		}, function(data) {
			expect(data).to.be.ok;
			wink.user().device('Home Downstairs Thermostat', function(return_device) {
				device = return_device;
				console.log("device:",device);
				done();
			});
		});
	});

	it("should get thermostat", function() {
		expect(device.device_group).to.equal('thermostats');
	});

	it("should return thermostat id", function() {
		expect(Number(device.device_id)).to.be.a('number');
	});

	it("should change temperature", function(done) {
		device.temperature(74, function(response) {
			console.log("response from change: ", response);
			expect(response).to.be.ok;
			done();
		});
	});

	it("should change temperature with min set", function(done) {
		device.temperature(74, 73, function(response) {
			console.log("response from change: ", response);
			expect(response).to.be.ok;
			done();
		});
	});

	it("should change temperature with min set and in celsius", function(done) {
		device.temperature(21, 20, 'c', function(response) {
			console.log("response from change: ", response);
			expect(response).to.be.ok;
			done();
		});
	});

	it("should change temperature in celsius", function(done) {
		device.temperature(21, 'c', function(response) {
			console.log("response from change: ", response);
			expect(response).to.be.ok;
			done();
		});
	});

	it("should change temperature in fahrenheit", function(done) {
		device.temperature(72, 'f', function(response) {
			console.log("response from change: ", response);
			expect(response).to.be.ok;
			done();
		});
	});

	it("should get temperature", function(done) {
		device.temperature(function(temp) {
			expect(temp).to.equal(22);
			done();
		});
	});

	it("should get temperature in f with callback", function(done) {
		device.temperature('f', function(temp) {
			expect(temp).to.equal(72);
			done();
		});
	});

	it("should get temperature in f with return", function(done) {
		var temp = device.temperature('f');
		expect(temp).to.equal(72);
		done();
	});

	it("should get temperature in c with return", function(done) {
		var temp = device.temperature('c');
		expect(temp).to.equal(22);
		done();
	});

	it("should get temperature in c with callback", function(done) {
		device.temperature('c', function(temp) {
			expect(temp).to.equal(22);
			done();
		});
	});

});
