var         util    = require('util'),
			crypto  = require('crypto'),
			redis   = require('redis'),
			client  = redis.createClient(),
			events  = require('events');
			
var Gandalf = function() {
  events.EventEmitter.call(this);
	self = this;
	
	
	/**
	 * Gandalf will hold the bridge and tests every request (req).
	 * If a capability it required (redis-store) and the user does not
	 * own the capability, a 401 - Permission denied will be thrown.
	 * Otherwise the user will get the requested url.
	 */
	this.guard = function() {
		var secureFn = function(req, res, next) {
      self.finalize = next;
      var hash = crypto.createHash('md5').update(req.url + req.method).digest('hex');
			client.exists(hash, function(error, exists) {
				if(exists == 1)
					if((new RegExp('^(' + req.user.capabilities.join('|') + ')$').test(hash))) {
						return next();
					} else {
						// YOU SHALL NOT PASS!
						return next(new Error(401));
					}
      });
      return next();
    };
    return secureFn;
  };
	
	
	/**
	 * Pass a url and method ("/url", "GET") to create a capability
	 * and protect the resource. The hash will be returned which can
	 * be assigned to users which are allowed to pass.
	 */
	this.protect = function(url, method, callback) {
		var hash = crypto.createHash('md5').update(url + method).digest('hex');
		console.log("Protecting url: " + url);
		client.hset(hash, "url", url, function(error, success) {
			client.hset(hash, "method", method, function(error, success) {
				if(error) {
					console.log("Error " + error);
					callback(false);
				} else {
					callback(hash);
				}
			});
		});
	}
	
	
	/**
	 * Pass a url and method ("/url", "GET") to release the block.
	 */
	this.release = function(url, method, callback) {
		var hash = crypto.createHash('md5').update(url + method).digest('hex');
		console.log("Releasing url: " + url);
		client.del(hash, function(error, success) {
			if(error) {
				console.log("Error " + error);
				callback(false);
			} else callback(true);
		});
	}
};

util.inherits(Gandalf, events.EventEmitter);
exports.Gandalf = Gandalf;