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
