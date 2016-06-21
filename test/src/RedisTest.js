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
