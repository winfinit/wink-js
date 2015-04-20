var expect = require('chai').expect;
var wink = require('../../../index');

describe("Wink devices", function() {

	before(function(done) {
		wink.init({
			conf: process.env.WINK_CONF || '.wink_auth.json'
		}, function(data) {
			expect(data).to.be.ok;
			done();
		});
	});

	it("should turn lights on", function(done) {
		wink.user().device('Kitchen', function(device) {
			device.power.on(function(response) {
				expect(response).to.be.ok;
				done();
			});		
			// expect(data).to.be.an('object');
			// expect(data.data).to.include.keys('name');
		});
	});

	it("should dim lights to 50%", function(done) {
		wink.user().device('Kitchen', function(device) {
			device.brightness(50, function(response) {
				expect(response).to.be.ok;
				done();
			});		
		});
	});
	
	it("should turn lights off", function(done) {
		wink.user().device('Kitchen', function(device) {
			device.power.off(function(response) {
				expect(response).to.be.ok;
				done();
			});		
			// expect(data).to.be.an('object');
			// expect(data.data).to.include.keys('name');
		});
	});


});
