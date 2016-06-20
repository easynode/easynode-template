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

describe('UserTest', function () {

    before(function (done) {
        console.log("UserTest before");
        try {
            done();
        } catch (e) {
            done(e);
        }
    });

    it('create a new user',function (done){
        request.post(urlBase+'/user')
            .set('Content-Type','application/json;charset=utf-8')
            .send({"account":"hujb2000@163.com","accountid":"allen.hu","email":"hujb2000@163.com","phonenumber":"18657105763","salt":"12345","passwordsha":"1234561213123"})
            .accept('json')
            .end(function(err, res){
                // Do something
                assert( res.body.resCode === 0, 'expected to add new user success' );
                newUserId = res.body.data.id;
                done();
            });
    });

    it('open the page to create a new user',function (done){
        request.get(urlBase+'/add/user')
            .set('Content-Type','application/json;charset=utf-8')
            .accept('text/html')
            .end(function(err, res){
                // Do something
                console.log(res.text);
                done();
            });
    });

      it('update user',function (done){
          request.put(urlBase+'/user/1')
              .set('Content-Type','application/json;charset=utf-8')
              .send({"id":newUserId,"account":"hujb2000@163.com","accountid":"allen.hu","email":"hujb2000@163.com","phonenumber":"*****","salt":"12345","passwordsha":"1234561213123"})
              .accept('text/html')
              .end(function(err, res){
                  // Do something
                  assert( res.body.resCode === 0, 'expected to update user info success');
                  done();
              });
      });

      it('get a user by id',function (done){
          request.get(`${urlBase}/user/${newUserId}`)
              .set('Content-Type','application/json;charset=utf-8')
              .accept('text/html')
              .end(function(err, res){
                  // Do something
                  assert( newUserId === res.body.data.id, 'expected req userid equal res userid');
                  done();
              });
      });

      it('get user list',function (done){
          request.get(`${urlBase}/user/0/20`)
              .set('Content-Type','application/json;charset=utf-8')
              .accept('text/html')
              .end(function(err, res){
                  // Do something
                  assert( res.body.resCode === 0, 'expected res.body.resCode === 0');
                  assert( res.body.data.data.length > 0, 'expected not empty');
                  assert( res.body.data.data.length <= 20, 'expected not exceeded the limit per page');
                  done();
              });
      });

       it('delete a user',function (done){
           request.delete(`${urlBase}/user/${newUserId}`)
               .set('Content-Type','application/json;charset=utf-8')
               .accept('text/html')
               .end(function(err, res){
                   // Do something
                   assert( res.body.resCode === 0, 'expected delete user success');
                   assert( res.body.data.id == newUserId, 'expected delete the specified user ');
                   assert( parseInt(res.body.data.id) === newUserId, 'expected delete the specified user ');
                   done();
               });
       });


    after(function (done) {
        console.log("UserTest after");
        done();
    });

});
