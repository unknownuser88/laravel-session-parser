## laravel-session-parser

Validate laravel 5 session in Node.js

[Config](https://laravel.com/docs/5.0/session#configuration) your laravel app to store session in mysql or redis

#### Install

```
npm install laravel-session-parser
```

#### Usage


```javascript
var lsp = require('laravel-session-parser');
```

#### Examples:


##### mysql exapmle
```javascript
var SECRET_KEY = 'LARAVEL_KEY';

io.use(function(socket, next) {

    var cookies = cookie.parse(socket.handshake.headers.cookie);
    var laravelSession = cookies.laravel_session;
    var sessionId = lsp.decryptSession(laravelSession, SECRET_KEY);
	// function return session from db sessions table, see example bellow
    getSessionMysql(sessionId, function(err, session) {
        if (!err && session) {
            lsp.getUserIdFromSessionIdMysql(session, function(u_id) {
                if (u_id) {
                    return next();
                };
                return next(new Error('Authentication error'));
            })
        } else {
            return next(new Error('Authentication error'));
        };
    })
});
```

##### redis exapmle
```javascript
var SECRET_KEY = 'LARAVEL_KEY';

io.use(function(socket, next) {

    var cookies = cookie.parse(socket.handshake.headers.cookie);
    var laravelSession = cookies.laravel_session;
    var sessionId = lsp.decryptSession(laravelSession, SECRET_KEY);
	// function return session from db sessions table, see example bellow
    getSessionRedis(sessionId, function(err, session){
        if (!err && session) {
            lsp.getUserIdFromSessionIdRedis(session, function(u_id) {
                if (u_id) {
                    return next();
                };
                return next(new Error('Authentication error'));
            })
        } else {
            return next(new Error('Authentication error'));
        };
    })
});
```




```javascript
// just example, you can use your own
function getSessionMysql (s_id, cb) {
	mysql.query('SELECT payload from `sessions` WHERE `id`= "' + s_id + '"', function(err, rows, fields) {
		if (err) {
			cb && cb (err);
			return;
		};
		if (rows.length > 0) {
			cb && cb (null, rows[0].payload);
		} else {
			cb && cb (null, false);
		};
	});
}

function getSessionRedis (s_id, cb) {
	var _sessionId = 'laravel:' + s_id;
	client.get(_sessionId, function(err, session) {
		if (err) {
			cb && cb (err);
			return;
		};
		cb && cb (null, session);
	});
}
```