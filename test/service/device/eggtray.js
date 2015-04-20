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

	it("should get eggminder", function(done) {
		wink.user().device('Egg Minder', function(device) {
			expect(device.device_group).to.equal('eggtrays');
			done();
		});
	});

	it("should return egg quantity", function(done) {
		wink.user().device('Egg Minder', function(device) {
			expect(device.quantity).to.be.a('number');
			done();
		});
	});

});
