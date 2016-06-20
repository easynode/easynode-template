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
                console.log(res.text);
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
            .send({"id":1,"account":"hujb2000@163.com","accountid":"allen.hu","email":"hujb2000@163.com","phonenumber":"*****","salt":"12345","passwordsha":"1234561213123"})
            .accept('text/html')
            .end(function(err, res){
                // Do something
                console.log(res.text);
                done();
            });
    });

    it('get a user by id',function (done){
        request.get(urlBase+'/user/1')
            .set('Content-Type','application/json;charset=utf-8')
            .accept('text/html')
            .end(function(err, res){
                // Do something
                console.log(res.text);
                done();
            });
    });


    it('get user list',function (done){
        request.get(urlBase+'/user/1/20')
            .set('Content-Type','application/json;charset=utf-8')
            .accept('text/html')
            .end(function(err, res){
                // Do something
                console.log(res.text);
                done();
            });
    });

    it('delete a user',function (done){
        request.delete(urlBase+'/user/1')
            .set('Content-Type','application/json;charset=utf-8')
            .accept('text/html')
            .end(function(err, res){
                // Do something
                console.log(res.text);
                done();
            });
    });


    after(function (done) {
        console.log("UserTest after");
        done();
    });

});
