var mcrypt = require('mcrypt'),
	phpunserialize = require('php-unserialize');

var self = {
	ord: function(string) {
		return string.charCodeAt(0);
	},
	decryptSession: function(cookie, secret) {
		var cookie = JSON.parse(new Buffer(cookie, 'base64'));
		var iv = new Buffer(cookie.iv, 'base64');
		var value = new Buffer(cookie.value, 'base64');
		var rijCbc = new mcrypt.MCrypt('rijndael-128', 'cbc');
		rijCbc.open(secret, iv);
		var decrypted = rijCbc.decrypt(value).toString();
		var len = decrypted.length - 1;
		var pad = self.ord(decrypted.charAt(len));
		var sessionId = phpunserialize.unserialize(decrypted.substr(0, decrypted.length - pad));
		return sessionId;
	},
	getUidFromObj: function(obj) {
		var cookieKey = 'login_82e5d2c56bdd0811318f0cf078b78bfc';
		var regexp = /login_([a-zA-Z0-9]+)/gi;
		var u_id = null;
		if (obj.hasOwnProperty(cookieKey)) {
			u_id = obj[cookieKey];
		} else {
			for (var key in obj) {
				var matches_array = key.match(regexp);
				if (matches_array && matches_array.length > 0) {
					u_id = obj[matches_array[0]]
				};
			}
		};
		return u_id;
	},
	getUserIdFromSessionIdRedis: function(session, _callback) {
		var u_id = null;
		try {
			var laravelSession = phpunserialize.unserialize(phpunserialize.unserialize(session));
			u_id = self.getUidFromObj(laravelSession);
		} catch (err) {
			console.log('err', err);
		}
		_callback(u_id);
	},
	getUserIdFromSessionIdMysql: function(session, _callback) {
		var session = new Buffer(session, 'base64').toString(),
			u_id = null;
		try {
			var laravelSession = phpunserialize.unserialize(session)
			u_id = self.getUidFromObj(laravelSession);
		} catch (err) {
			console.log('err', err);
		}
		_callback(u_id);
	}
};
module.exports = self;