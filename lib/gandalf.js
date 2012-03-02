var 	util    = require('util'),
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
      var h = crypto.createHash('md5').update("/forumsDELETE").digest("hex");
      console.log(h);
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
	this.protect = function(url, method) {
		var hash = crypto.createHash('md5').update(url + method).digest('hex');
		console.log("Setting hash: " + hash);
		client.set(hash, 1, function(error, success) {
			if(error) {
				console.log("Error " + error);
				return null;
			} else {
				return hash;
			}
		});
	}
	
	
	/**
	 * Pass a url and method ("/url", "GET") to release the block.
	 */
	this.release = function(url, method) {
		var hash = crypto.createHash('md5').update(url + method).digest('hex');
		console.log("Releasing hash: " + hash);
		client.del(hash, function(error, success) {
			if(error) {
				console.log("Error " + error);
			}
		});
	}
};

util.inherits(Gandalf, events.EventEmitter);
exports.Gandalf = Gandalf;