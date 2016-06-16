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
        var url = `${cfg.urlPath}${key}`;
        let nos = new Nos(cfg.accessKey, cfg.secretKey, cfg.bucket);
        try {
          yield nos.upload(key, filename);
        } catch (e) {
          // console.log(e);
        }
        nos = null;
        return url;
      };
    }
```