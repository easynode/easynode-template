/**
 * Created by hujiabao on 9/21/15.
 */

'use strict';

require("babel-polyfill");
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';

var key = '';

describe('NosTest',function() {

    before(function(done){
        console.log("NosTest before");
        try{
            key = Date.now();
            done();
        }catch(e){
            done(e);
        }
    });

    it('nos upload',function (done){
        request.post(`http://127.0.0.1:8899/upl/?key=${key}`)
            .attach('docker_file','test/mock/1.jpg')
            .accept('json')
            .end(function(err, res){
                // Do something
                if(err){
                    done(err);
                }else{
                    var url = JSON.parse(res.text).url;
                    console.log(url);
                    //assert.equal( url , `http://${}.nos.netease.com/${key}`);
                    done();
                }
            });
    });

    it('jpg download',function (done){
            var writeStream = fs.createWriteStream('test/mock/2.jpg');
            writeStream.on('finish',() => {
                console.log("All writes are now complete");
                done();
            } );
            writeStream.on('error',(e) => {
                done(e);
            } );
            req(`http://apollodev.nos.netease.com/1466082458823`).pipe(writeStream);
    });

    it('nos download',function (done){
        var writeStream = fs.createWriteStream('test/mock/3.jpg');
        writeStream.on('finish',() => {
            console.log("All writes are now complete");
            done();
        } );
        writeStream.on('error',(e) => {
            done(e);
        } );
        req(`http://nos.netease.com/icp/1466134750797?NOSAccessKeyId=a7eefc30be4545b8af96e3f40ee08d35&Expires=4619733671&Signature=5G29u2KoZPxltl7GTG60TPtkZQ3EjD0LT7DqJoFuOJQ%3D`)
            .pipe(writeStream);
    });


    after(function(done){
        console.log("NosTest after");
        done();
    });

});
