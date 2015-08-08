var expect = require('chai').expect;
var wink = require('../../index');

describe("Wink user", function() {

	before(function(done) {
		wink.init({
			conf: process.env.WINK_CONF || '.wink_auth.json'
		}, function(data) {
			expect(data).to.be.ok;
			done();
		});
	});

	it("should retrieve user information", function(done) {
		wink.user().get(function(data) {
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data).to.include.keys('errors');
			expect(data).to.include.keys('pagination');
			expect(data.data).to.include.keys('user_id');
			expect(data.data).to.include.keys('first_name');
			expect(data.data).to.include.keys('last_name');
			expect(data.data).to.include.keys('locale');
			expect(data.data).to.include.keys('email');
			done();
		});
	});
	it("should returned linked services", function(done) {
		wink.user().linked_services.get(function(data){
			/*
			{ data: [], errors: [], pagination: { count: 0 } }
			*/
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data).to.include.keys('errors');
			expect(data).to.include.keys('pagination');
			done();
		});
	}),
	it("should return all available devices", function(done) {
		wink.user().devices(function(data) {
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data).to.include.keys('errors');
			expect(data).to.include.keys('pagination');
			expect(data.data).to.be.an('array');
			done();
		});
	});
	it("should return all light bulbs", function(done) {
		/*
			light_bulbs
			remotes
		*/
		wink.user().devices('light_bulbs', function(data) {
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data).to.include.keys('errors');
			expect(data).to.include.keys('pagination');
			expect(data.data).to.be.an('array');
			done();
		});
	});
	it("should return all robots", function(done) {
		wink.user().robots.get(function(data) {
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data).to.include.keys('errors');
			expect(data).to.include.keys('pagination');
			expect(data.data).to.be.an('array');
			done();
		});
	});
	it("should return all groups", function(done) {
		wink.user().groups.get(function(data) {
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data.data).to.be.an('array');
			done();
		});
	});
	it.only("should return single group by name", function(done) {
		wink.user().group.name("test", function(data) {
			expect(data).to.be.an('object');
			done();
		});
	});
	it("should return single group by id", function(done) {
		wink.user().group.id(3598245, function(data) {
			expect(data).to.be.an('object');
			done();
		});
	});
	it("should return all scenes", function(done) {
		wink.user().scenes.get(function(data) {
			expect(data).to.be.an('object');
			expect(data).to.include.keys('data');
			expect(data).to.include.keys('errors');
			expect(data).to.include.keys('pagination');
			expect(data.data).to.be.an('array');
			done();
		});
	});
});
