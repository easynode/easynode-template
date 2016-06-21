
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

## Message Breaker

## Cache Data


