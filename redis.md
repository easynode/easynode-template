
# Demo for Redis

## What is Redis?

[Redis](https://redis.io) is an open source (BSD licensed), in-memory data structure store, used as database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs and geospatial indexes with radius queries. Redis has built-in replication, Lua scripting, LRU eviction, transactions and different levels of on-disk persistence, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.


Generally  the redis server have several usage scenarios in the web development  process.

* Distributed sharing Session.
* API Rate Limit
* Message Breaker
* Cache Data

### Start Redis Server

```
docker run -d --name redis  -p 6379:6379  -v `pwd`/redis.conf:/usr/local/etc/redis/redis.conf -v `pwd`/redis_db/:/data redis redis-server /usr/local/etc/redis/redis.conf
```


## Distributed sharing  Session

redis client config:
```
"redis":{
    "host": '',
    "port": ,
    "db":0,
    "auth_pass": ''
  }
```

We use the redis to store [koa sesssions](https://github.com/koajs/generic-session),

* After adding session middleware, you can use `this.session` to set or get the session.
* Setting `this.session = null;` will destroy this session

### Code fragement for session's count

Routes.js:

```
// Session Demo
httpServer.addRoute('get','/session/',Controllers.getSession(httpServer));
httpServer.addRoute('delete','/session/',Controllers.delSession(httpServer));
```

Controller.js
```
 static getSession(app){
    return function *(id){

        var session = this.session;
        session.count = session.count || 0;
        session.count++;

        this.type = 'json';
        this.body = session.count;
    };
}

static delSession(app){
    return function *(id){

		this.session = null;

        this.type = 'json';
        this.body = 0;
    };
}
```

test code, RedisTest.js

```
/**
 * Created by hujiabao on 6/17/16.
 */

'use strict';

require("babel-polyfill");
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;

var urlBase = 'http://127.0.0.1:8899';

var cookie = {};

describe('RedisTest', function () {

    before(function (done) {
        console.log("RedisTest before");
        try {
            done();
        } catch (e) {
            done(e);
        }
    });

    it('session count++',function (done){
        request.get(urlBase+'/session')
            .set('Content-Type','application/json;charset=utf-8')
            .accept('json')
            .end(function(err, res){
                // Do something
                cookie = res.headers['set-cookie'];
                assert( res.body === 1, 'expected to session.count++ success' );
                done();
            });
    });

       it('delete session',function (done){
           request.delete(`${urlBase}/session`)
               .set('Cookie',cookie.join(';'))
               .set('Content-Type','application/json;charset=utf-8')
               .accept('text/html')
               .end(function(err, res){
                   // Do something
                   assert( res.body === 0, 'expected delete session success');
                   done();
               });
       });

    after(function (done) {
        console.log("RedisTest after");
        done();
    });

});

```
## API Rate Limit

Utilize the life circle of record in the redis, we can limit the rate to call API.

* Step 1: Add Redis Config

```
"redisRatelimit":{
"host": "127.0.0.1",
"port": 6379,
"db": 2,
"auth_pass": ""
  }
```

in the Main.js
* Step 2: Import the class declaration

```
import rateLimit from 'koa-ratelimit';
import redis from 'redis';
```

add the rate limit middleware:

```
 httpServer.addMiddleware(rateLimit({
                db:redis.createClient(config.redisRatelimit),
                duration:60000,
                max:100,
                id: function(context){
                    return context.url;
                },
                headers:{
                    remaining: 'Rate-Limit-Remaining',
                    reset: 'Rate-Limit-Reset',
                    total: 'Rate-Limit-Total'
                }
            }));
```
here id can be the context's attribute as the key, such as ip, url, path etc.

* Step 3: Test code

```
/**
 * Created by hujiabao on 6/17/16.
 */

'use strict';

require("babel-polyfill");
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;

var urlBase = 'http://127.0.0.1:8899';

var newUserId = 0;

describe('RateLimitTest', function () {

    before(function (done) {
        console.log("RateLimitTest before");
        try {
            done();
        } catch (e) {
            done(e);
        }
    });

    for( var j=0; j < 111; j++ ){
        it('RateLimit test',function (done){
                request.get(`${urlBase}`)
                    .set('Content-Type','application/json;charset=utf-8')
                    .accept('text/html')
                    .end(function(err, res){
                        // Do something
                        if( res.status === 200 ){
                            assert( parseInt(res.headers['rate-limit-remaining']) >= 0 && res.status === 200, 'can continue' );
                        }else{
                            assert( parseInt(res.headers['rate-limit-remaining']) === 0 && res.status === 429, 'Too Many Requests' );
                        }
                        done();
                    });
            });
    }

    after(function (done) {
        console.log("RateLimitTest after");
        done();
    });

});

```

* References:  [node-ratelimit](https://github.com/tj/node-ratelimiter)

## Message Breaker-Pub/Sub

Publ/Sub published messages are characterized into channels, without knowledge of what (if any) subscribers there may be. Subscribers express interest in one or more channels, and only receive messages that are of interest, without knowledge of what (if any) publishers there are. This decoupling of publishers and subscribers can allow for greater scalability and a more dynamic network topology.



## Cache Data


