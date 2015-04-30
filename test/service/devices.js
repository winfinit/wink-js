var expect = require('chai').expect;
var wink = require('../../index');

describe("Wink devices", function() {

	before(function(done) {
		wink.init({
			conf: process.env.WINK_CONF || '.wink_auth.json'
		}, function(data) {
			expect(data).to.be.ok;
			done();
		});
	});

	it("should return device", function(done) {
		wink.device_group('light_bulbs').device_id('562635').get(function(data) {		
			expect(data).to.be.an('object');
			expect(data.data).to.include.keys('name');
			done();
		});
	});
	
});
