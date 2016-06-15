
#  Get Started

This is a template project to illustrate how to use the EasyNode frame. You can pay attention to different branches.

## Tutorials

First make sure that you have installed the Git client and Node(>4.0.0) program. If you want to run it with docker container , and you must first install the docker daemon.

### Hello World

* Step 1: Checkout the code

check out the code.

```
git clone https://github.com/easynode/easynode-template.git

git branch -r   //show remote branchs


hujiabaos-MacBook-Pro:easynode-template hujiabao$ git branch -r
  origin/HEAD -> origin/master
  origin/helloworld
  origin/master


git checkout origin/helloworld
```

* Step 2: Generate Scaffolding

By running  `sh init_project.sh` to generate scaffolding, In the making the scaffolding, it will ask you to enter the below four parameters:

* compnay'name (dot disallowed)
* project name (dot disallowed)
* web port
* author name

```
current working directory is :
/Users/hujiabao/workspace_docker/easynode-template/easynode-template/easynode-template/easynode-template
now it is:
Wed Jun 15 21:13:08 CST 2016
welcome to easnynode!
Please input company'name:
netease
Please input project'name:
stock
Please input http server's port:
8899
Please input author's name:
hjb
Company: netease
Project: monitor
AUTHOR: hjb
PORT: 8899
```

* Step 3: Install the dependencies

In the same directory as the file package.json, run `npm install`

 * Step 4: Run Hello World

 ```
 cd bin
 sh dev_start.sh
 ```

 You open the http:://127.0.0.1:8899 in the browser, You will see the output "Hello World!"

#### Files Descriptions

* plugins/views/index.html

This is a simple static page

 ```
 <!DOCTYPE html>
 <html lang="en">
 <head>
 	<meta charset="UTF-8">
 	<title>Document</title>
 </head>
 <body>
 	Hello World!
 </body>
 </html>
 ```

* netease.monitor.backend.controllers.Controllers.js

```
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var fs = require('co-fs');
var FileService =  using('easynode.framework.util.FileService');
var multipart = require('co-multipart');
var f =  require('fs');
var util = require('util');
var thunkify = require('thunkify');

(function () {
    /**
     * Class Controllers
     *
     * @class netease.monitor.backend.controllers.Controllers
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Controllers extends GenericObject
    {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor()
        {
            super();
            //调用super()后再定义子类成员。
        }


        /**
         * @api:
         * @apiDescription: 首页
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static home(app){
            return function *(){
                yield this.render('index',{});
            }
        }


        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Controllers;
})();
```

* netease.monitor.backend.routes.Routes.js

```
'use strict'

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var thunkify = require('thunkify');

import Controllers from '../controllers/Controllers';


(function () {
    /**
     * Class Routes
     *
     * @class {COMPANY}.{PROJECT}.routes.Routes
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Routes extends GenericObject
    {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor()
        {
            super();
            //调用super()后再定义子类成员。
        }

        static defineRoutes(httpServer)
        {
            Routes.addRoute(httpServer);

            httpServer.addTemplateDirs('plugins/views');
        }

        static addRoute(httpServer)
        {
            httpServer.addRoute('get', '/', Controllers.home(httpServer));
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports  = Routes;
})();
```

* netease.monitor.backend.Main.js

```
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var thunkify = require('thunkify');
var Routes = using('{COMPANY}.{PROJECT}.backend.routes.Routes');
var MySqlDataSource = using('easynode.framework.db.MysqlDataSource');
var HTTPUtil =  using('easynode.framework.util.HTTPUtil');

(function () {
    /**
     * Class Main
     *
     * @class {COMPANY}.{PROJECT}.backend.Main
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Main extends GenericObject
    {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor()
        {
            super();
            //调用super()后再定义子类成员。
        }

        static * main(){

            //HTTP Server
            var KOAHttpServer =  using('easynode.framework.server.http.KOAHttpServer');
            var httpPort = S(EasyNode.config('http.server.port','7000')).toInt();
            var httpServer = new KOAHttpServer(httpPort);

            //设置ContextHook,
            httpServer.setActionContextListener({
                onCreate: function (ctx) {
                    console.log("onCreate");
                    return function * () {
                    };
                },
                onDestroy: function (ctx) {
                    console.log("onDestroy");
                    return function * () {

                    };
                },

                onError: function (ctx, err) {
                    console.log("onError");
                    return function * () {
                    };
                }
            });

            httpServer.name = EasyNode.config('http.server.name','{PROJECT}-Service');
            Routes.defineRoutes(httpServer);
            yield httpServer.start();
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Main;
})();
```