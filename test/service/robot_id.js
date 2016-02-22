var expect = require('chai').expect;
var wink = require('../../index');

describe("Wink robots", function() {

	before(function(done) {
		wink.init({
			conf: process.env.WINK_CONF || '.wink_auth.json'
		}, function(data) {
			expect(data).to.be.ok;
			done();
		});
	});

	it("should cache all the robots",function(done) {
			wink.user().robots.get(function(data) {
				var g = wink.GET
				wink.GET = function(data,callback) {
					callback(null);
				}
				for(var i = 0; i< data.data.length; i++) {
					wink.robot_id(data.data[i].robot_id).get(function(device) {
							expect(device).to.be.an('object');
							expect(device == data.data[i]).to.equal(true);
						});
				}
				wink.GET = g;
				done();
			});
	});
  it("should return robots", function(done) {
    wink.user().robots.get(function(data) {
      expect(data).to.be.an('object');
      expect(data).to.include.keys('data');
      expect(data).to.include.keys('errors');
      expect(data).to.include.keys('pagination');
      expect(data.data).to.be.an('array');
      done();
    })
  });
	it('should fetch the same robot as pulled from robots',function(done) {
    wink.user().robots.get(function(data) {
      //find robot named test
      for(var i = 0; i< data.data.length; i++) {
        if(data.data[i].name == "Test") {
          wink.robot_id(data.data[i].robot_id).get(function(device) {
						expect(device).to.be.an('object');
            expect(device).to.include.keys('robot_id');
            expect(device.name).to.equal('Test');
						done();
		      });
        }
      }
    });
  });
  it("should disable robot",function(done) {
    wink.user().robots.get(function(data) {
      //find robot named test
      for(var i = 0; i< data.data.length; i++) {
        if(data.data[i].name == "Test") {
					device = data.data[i];
					expect(device).to.be.an('object');
          expect(device).to.include.keys('robot_id');
          expect(device.name).to.equal('Test');
					device.state.disabled(function(response) {
						expect(response).to.be.ok;
						done();
					});
        }
      }
    });
  });
	it("should enable robot",function(done) {
		wink.user().robots.get(function(data) {
			//find robot named test
			for(var i = 0; i< data.data.length; i++) {
				if(data.data[i].name == "Test") {
					device = data.data[i];
					expect(device).to.be.an('object');
					expect(device).to.include.keys('robot_id');
					expect(device.name).to.equal('Test');
					device.state.enabled(function(response) {
						expect(response).to.be.ok;
						done();
					});
				}
			}
		});
	});
});
