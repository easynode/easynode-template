# Demo for NOS

## What is NOS?

[NOS(Netease Object Storage)](https://c.163.com) is a cloud storage platform based on a distributed file system. Users can easily upload and download files of various sizes through a simple RESTful API on various platforms, and can easily view resource usage statistics.
Now it is only for internal users, in the future will be open to external users.

## How to USE NOS?

* Step 1: Apply a barrel

Go to the [NOS service platform](https://c.163.com) to apply a barrel. In there you will get the config. such as

```
 "nos": {
    "urlPath": "",
    "accessKey": "",
    "secretKey": "",
    "bucket": ""
  }
```

* Step 2: Code Fragement

in the {COMPANY}/{PROJECT}/routes/Route.js, add this line.

```
httpServer.addRoute('post', '/upl', Controllers.upload(httpServer));
```

in the {COMPANY}/{PROJECT}/backend/Main.js

```
			var configUrl = process.env.CONFIG_URL;
            var config = {};
            if( configUrl.startsWith('http') ){
                config = yield HTTPUtil.getBinary(configUrl);
            } else {
                config = yield fs.readFile(configUrl,'utf8');
            }
            config = JSON.parse(config);
```
in the {COMPANY}/{PROJECT}/controllers/Controllers.js

```
 /**
       * @api {get} /upl/ 上传文件
       * @apiName upload
       * @apiGroup NOS
       * @apiPermission
       * @apiVersion 0.0.2
       * @apiDescription
       *
       * @apiParam {Object[]} multipart 文件对象,这里仅允许每次请求一个文件
       *
       * @apiSampleRequest http://icp.hzspeed.cn/upl/

       * @apiSuccess {String} url NOS_URL
       *
       * @apiUse
       */
    static upload(app) {
      var supportFileTypes = '^.*.(?:jpg|png|gif)$';
      var regEx = new RegExp(supportFileTypes);

      return function *() {
        var session = this.session;
                // if( session.hasOwnProperty('firms') ){
                //    delete session.firms;
                // }
        this.state.upload = 0;
        if (this.method.toLocaleLowerCase() == 'post') {
          var hasError = false;
          var filename = '';
          var url = '';
          var parts = yield* multipart(this);
          for (const file of parts.files) {
            if (file.filename.match(regEx)) {
              var storeService = new StoreService(app);
              url = yield storeService.uploadNos(Date.now() + encodeURIComponent(file.filename), file.path);
              filename = file.filename;
            } else {
              parts.dispose();
              this.status = 403;
              this.body = `403 Forbidden : Unsupported type of upload file [${file.filename}]`;
              hasError = true;                // ignore downstream middleware
            }
          }
          parts.dispose();


          this.type = 'json';
          this.body = {url:url};
        } else {
          EasyNode.DEBUG && logger.debug('multipart must post');
        }
      };
    }
```

in the {COMPANY}/{PROJECT}/services/StoreService.js

```
    /*
          * key:  object key, can be date object
          * filename: 文件名
          * */
      uploadNos(key, filename) {
        var me = this;
        var cfg = me.app.config.nos;
        return function *() {
          var url = '';
          let nos =  new Nos(cfg.public,cfg.host,cfg.accessKey, cfg.secretKey, cfg.bucket);
          try {
            var ret = yield nos.upload(key, filename);
            url = ret.url;
            EasyNode.DEBUG && logger.debug(`upload object key is ${key} and url is ${ret.url}`);
          } catch (e) {
            EasyNode.DEBUG && logger.error(e);
          }finally{
            nos = null;
            //var downInfo = yield me.downloadNos(key);
            //EasyNode.DEBUG && logger.debug(downInfo.url);
            return url;
          }
        };
      }

          /*
          * key:  object key, can be date object
          * filename: 文件名
          * */
      downloadNos(key) {
        var me = this;
        var cfg = me.app.config.nos;
        return function *() {
          let nos = new Nos(cfg.public,cfg.host,cfg.accessKey, cfg.secretKey, cfg.bucket);

          var ret = '';
          try {
            ret = yield nos.getObject(key,cfg.expires);
          } catch (e) {
            EasyNode.DEBUG && logger.error(e);
          }
          //{body:body,url:url}
          nos = null;
          return ret;
        };
      }
```

* Step 3 : Test

in the test/src/NosTest.js

```
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
```

* Step 4: Run the NosTest

```
cd bin;  CONFIG_URL='../config/config.json' sh dev_start.sh

cd ..; npm test
```