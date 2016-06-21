
# Demo for RDS

## What is RDS?


[RDS(Relational Database Service)](https://c.163.com) is a fully compatible with MySQL  online database.


## How to USE RDS?

We will build a simple user table to illustrate how to implement the  standarded CRUD operation.

* Step 1: Start a MySQL Server by container

```
pwd
mkdir -p mysql_db/db;
cp my.cnf mysql_db;
docker run --name mysql --restart=always -v `pwd`/mysql_db/:/etc/mysql/conf.d -v `pwd`/mysql_db/db/:/var/lib/mysql -e MYSQL_ROOT_PASSWORD='' -e MYSQL_DATABASE='' -e MYSQL_USER='' -e MYSQL_PASSWORD='' -p 3306:3306  -d mysql
```

in the main.js:

```
 // Database source, connection pool
 var dataSource = new MySqlDataSource();
 dataSource.initialize(config.mysql);

// assign dataSource to application object
httpServer.dataSource = dataSource;
```

* Step 2: Create a table named "user"

notice: All field names must are lower case

```
CREATE TABLE `monitor_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `account` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT '' COMMENT '帐号',
  `accountid` varchar(50) CHARACTER SET utf8mb4 NOT NULL COMMENT '帐号ID',
  `email` varchar(50) CHARACTER SET utf8mb4 NOT NULL COMMENT '邮件地址',
  `phonenumber` varchar(20) CHARACTER SET utf8mb4 NOT NULL COMMENT '电话号码',
  `salt` varchar(128) CHARACTER SET utf8mb4 NOT NULL COMMENT '密码盐',
  `passwordsha` varchar(128) CHARACTER SET utf8mb4 NOT NULL COMMENT '密码SHA',
  `createtime` bigint(20) NOT NULL COMMENT '记录创建时间',
  `updatetime` bigint(20) NOT NULL COMMENT '记录更新时间',
  UNIQUE KEY `user_id_idx` (`id`) USING BTREE,
  UNIQUE KEY `user_account_idx` (`account`) USING BTREE,
  UNIQUE KEY `user_accountid_idx` (`accountid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=latin1;

```



* Step 3: Generate Standard class Files

###  Model Template

You  can generate User Model utilizing below model template. generate the file netease/monitor/backend/models/User.js

```
'use strict';
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Model = using('easynode.framework.mvc.Model');

(function() {
    /**
     * Class ${CLASSNAME}
     *
     * @class ${COMPANY}.${PROJECT}.backend.models.${CLASSNAME}
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
  class ${CLASSNAME} extends Model {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
    constructor() {
      super(`${CLASSNAME}`, `SELECT * FROM ${CLASSNAME}`);
            // 调用super()后再定义子类成员。
    }

        /**
         * 定义模型字段, 通过数据字段定义数据自动生成字段定义
         *
         * @method defineFields
         * @since 0.1.0
         * @author allen.hu
         * */
    defineFields() {
      this
                .defineField('id', 'int')
            ;
    }


    getClassName() {
      return EasyNode.namespace(__filename);
    }
    }

  module.exports = ${CLASSNAME};
})();

```

```
'use strict';
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Model = using('easynode.framework.mvc.Model');

(function () {
    /**
     * Class User
     *
     * @class netease.monitor.backend.models.User
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class User extends Model {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor() {
            super(`monitor_user`, 'SELECT * FROM monitor_user');
            // 调用super()后再定义子类成员。
        }

        /**
         * 定义模型字段
         *
         * @method defineFields
         * @since 0.1.0
         * @author allen.hu
         * */
        defineFields() {
            this
                .defineField('id', 'int')
                .defineField('account', 'string')
                .defineField('accountid', 'string')
                .defineField('email', 'string')
                .defineField('phonenumber', 'string')
                .defineField('salt', 'string')
                .defineField('passwordsha', 'string')
                .defineField('createtime', 'int')
                .defineField('updatetime', 'int')
            ;
        }


        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = User;
})();

```

### Route Template


RESTful API , Action Mapping:

```
http method     route                       function of ctrl
post            /${model}                   add resource
get             /add/${model}               Open Page for adding
put             /${model}/:id               Update resource
get             /${model}/:id               get resource detail
get             /${model}/:index/:pagesize  get resources of pagination
delete          /${model}:/id               delete resource
```

in the backend/routes/Routes.js , add below code fragement.

```
// ${model}
httpServer.addRoute('post','/${model}', Controllers.add${Model}(httpServer));
httpServer.addRoute('get','/add/${model}', Controllers.add${Model}Page(httpServer));
httpServer.addRoute('put','/${model}/:id',Controllers.update${Model}(httpServer));
httpServer.addRoute('get','/${model}/:id',Controllers.get${Model}(httpServer));
httpServer.addRoute('get','/${model}/:index/:pagesize',Controllers.get${Model}list(httpServer));
httpServer.addRoute('delete','/${model}/:id',Controllers.del${Model}(httpServer));
```


route template

```
// User
httpServer.addRoute('post','/user', Controllers.addUser(httpServer));
httpServer.addRoute('get','/add/user', Controllers.addUserPage(httpServer));
httpServer.addRoute('put','/user/:id',Controllers.updateUser(httpServer));
httpServer.addRoute('get','/user/:id',Controllers.getUser(httpServer));
httpServer.addRoute('get','/user/:index/:pagesize',Controllers.getUserlist(httpServer));
httpServer.addRoute('delete','/user/:id',Controllers.delUser(httpServer));
```

### Controller template

in the backend/controllers/Controllers.js

First import the class of processing logic.

```
var UserService =  using('netease.monitor.backend.services.UserService');
```

Controller Layer template,  Template variables:

* ${model}: All lower case
* ${Model}: First Letter upper, other lower case
* ${model_desc}: describe to model

```
 /**
         * @api {post} /${model} 添加${model_desc}
         * @apiName add${Model}
         * @apiGroup ${Model}
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/${model}/
         *
         * @apiParam {Object} ${model} ${model_desc}信息,模版里遍历该对像属性字段
         *
         * @apiUse APIReturn
         */
        static add${Model}(app){
            return function *(){

                var ${model}Service = new ${Model}Service(app);
                var ret = yield ${model}Service.add${Model}();

                this.type = 'json';
                this.body = ret ;
            };
        }

        /**
         * @api {get} /add/${model} 添加${model_desc}页面
         * @apiName add${Model}Page
         * @apiGroup ${Model}
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/add/${Model}/
         *
         * @apiSuccess 返回页面
         */
        static add${Model}Page(app){
            return function *(){
                yield this.render(`add-${model}`);
            };
        }

        /**
         * @api {put} /${model} 修改${model_desc}
         * @apiName update${Model}
         * @apiGroup ${Model}
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/${model}/:id
         *
         * @apiParam {Object} ${Model} ${model_desc}信息,模版里遍历该对像属性字段

         * @apiUse APIReturn
         */
        static update${Model}(app){
            return function *(id){

                var ${model}Service = new ${Model}Service(app);
                var ret = yield ${model}Service.update${Model}(id);

                this.type = 'json';
                this.body = ret;
            };
        }

        /**
         * @api {get} /${model}/:id 获取${model_desc}详情
         * @apiName get${Model}
         * @apiGroup ${Model}
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/${model}/:id
         *
         * @apiUse APIReturn
         */
        static get${Model}(app){
            return function *(id){

                var ${model}Service = new ${Model}Service(app);
                var ret = yield ${model}Service.get${Model}(id);

                this.type = 'json';
                this.body = ret;
            };
        }

        /**
         * @api {get} /${model}/:index/:pagesize 获取${model_desc}列表
         * @apiName get${Model}list
         * @apiGroup ${Model}
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/${model}/:index/:pagesize
         *
         * @apiUse APIReturn
         */
        static get${Model}list(app){
            return function *(index,pagesize){

                var ${model}Service = new ${Model}Service(app);
                var ret = yield ${model}Service.get${Model}List(index,pagesize);

                this.type = 'json';
                this.body = ret;
            };
        }

        /**
         * @api {delete} /${model}/:id 删除${model_desc}
         * @apiName del${Model}
         * @apiGroup ${Model}
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/${model}/:id
         *

         * @apiUse APIReturn
         */
        static del${Model}(app){
            return function *(id){

                var ${model}Service = new ${Model}Service(app);
                var ret = yield ${model}Service.del${Model}(id);

                this.type = 'json';
                this.body = ret;
            };
        }

```

Code fragement:

```
 /**
         * @api {post} /user 添加用户
         * @apiName addUser
         * @apiGroup User
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/user/
         *
         * @apiParam {Object} user 用户信息,模版里遍历该对像属性字段
         *
         * @apiUse APIReturn
         */
        static addUser(app){
            return function *(){

                var userService = new UserService(app);
                var ret = yield userService.addUser();

                this.type = 'json';
                this.body = ret ;
            };
        }

        /**
         * @api {get} /add/user 添加用户页面
         * @apiName addUserPage
         * @apiGroup User
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/add/user/
         *
         * @apiSuccess 返回页面
         */
        static addUserPage(app){
            return function *(){
                yield this.render('add-user');
            };
        }

        /**
         * @api {put} /user 修改用户
         * @apiName updateUser
         * @apiGroup User
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/user/:id
         *
         * @apiParam {Object} user 用户信息,模版里遍历该对像属性字段

         * @apiUse APIReturn
         */
        static updateUser(app){
            return function *(id){

                var userService = new UserService(app);
                var ret = yield userService.updateUser(id);

                this.type = 'json';
                this.body = ret;
            };
        }

        /**
         * @api {get} /user/:id 获取用户详情
         * @apiName getUser
         * @apiGroup User
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/user/:id
         *
         * @apiUse APIReturn
         */
        static getUser(app){
            return function *(id){

                var userService = new UserService(app);
                var ret = yield userService.getUser(id);

                this.type = 'json';
                this.body = ret;
            };
        }

        /**
         * @api {get} /user/:index/:pagesize 获取用户列表
         * @apiName getUserlist
         * @apiGroup User
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/user/:index/:pagesize
         *
         * @apiUse APIReturn
         */
        static getUserlist(app){
            return function *(index,pagesize){

                var userService = new UserService(app);
                var ret = yield userService.getUserList(index,pagesize);

                this.type = 'json';
                this.body = ret;
            };
        }

        /**
         * @api {delete} /user/:id 删除用户
         * @apiName delUser
         * @apiGroup User
         * @apiPermission
         * @apiVersion 0.0.1
         * @apiDescription
         *
         * @apiSampleRequest http://127.0.0.1:8899/user/:id
         *

         * @apiUse APIReturn
         */
        static delUser(app){
            return function *(id){

                var userService = new UserService(app);
                var ret = yield userService.delUser(id);

                this.type = 'json';
                this.body = ret;
            };
        }

```

### Service Template

* Step: 1

import model class and other class of processing Uniform format of the RESTful API.

```
var User = using('netease.monitor.backend.models.User');
var APIReturn =  using('easynode.framework.util.APIReturn');
```

Multiple inheritance:

```
class UserService extends Mixin.mix(GenericObject,APIReturn)
```

Service Layer Template:
${Model}
${...model_field}
${model_table}

```
 add${Model}(){
      var me = this;
      return function *(){

        try {
          var newId = 0;
          var ret = {};
          var body = this.request.body;
          var model = new ${Model}();
          var conn = yield me.app.dataSource.getConnection();

          model.merge( Object.assign( body, {createtime:Date.now(), updatetime:Date.now()} ) );

          var record = yield conn.create(model);
          newId = record.insertId;
          ret = me.APIReturn(0,'success',{id:newId});
        } catch (e) {
          EasyNode.DEBUG && logger.error(e);
          ret = me.APIReturn(1,'failed',{});
        } finally {
          yield me.app.dataSource.releaseConnection(conn);
          return ret;
        }
      }
    }

    update${Model}(id){
      var me = this;
      return function *(){

        try {
          var ret = {};
          var body = this.request.body;
          var model = new ${Model}();
          var conn = yield me.app.dataSource.getConnection();

          model.merge( Object.assign( body, {id:id, updatetime:Date.now()} ) );

          var record = yield conn.update(model);
          ret = me.APIReturn(0,'success',{id: id});
        } catch (e) {
          EasyNode.DEBUG && logger.error(e);
          ret = me.APIReturn(1,'failed',{});
        } finally {
          yield me.app.dataSource.releaseConnection(conn);
          return ret;
        }
      }
    }

      get${Model}(id){
        var me = this;
        return function *(){

          try {
            var ret = {};
            var record = null;
            var sql = '';
            var arr = [];
            var id2 = id || 0 ;
            var conn = yield me.app.dataSource.getConnection();

			//
            sql = 'SELECT ${...model_field} FROM ${model_table} WHERE id = #id#';
            arr = yield conn.execQuery( sql, {id:id2} );
            if (arr.length <= 0) {
              return ret;
            }
            record = arr[0];
            ret = me.APIReturn(0,'success',record);
          } catch (e) {
            EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
            ret = me.APIReturn(1,'fail',{});
          } finally {
            yield me.app.dataSource.releaseConnection(conn);
            return ret;
          }
        }
      }

      get${Model}List(index,pagesize){
        var me = this;
        return function *(){
            try {
              var ret = {};
              var model = new ${Model}();
              var conn = yield me.app.dataSource.getConnection();

              var data = yield conn.list(model,{id: {exp:'!=',value:0} }, {page: index, rpp: pagesize}, ['updatetime ASC']);

              ret = me.APIReturn(0,'success',data);
            } catch (e) {
              EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
              ret = me.APIReturn(1,'fail',{});
            } finally {
              yield me.app.dataSource.releaseConnection(conn);
              return ret;
            }
          };
      }

      del${Model}(id){
        var me = this;
        return function *(){

        try {
            var ret = {};
            var model = new ${Model}();
            var conn = yield me.app.dataSource.getConnection();

            var data = yield conn.del(model,[id]);
            //{ affectedRows: 1, insertId: 0 }
            ret = me.APIReturn(0,'success',{id: id});
          } catch (e) {
            EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
            ret = me.APIReturn(1,'fail',{});
          } finally {
            yield me.app.dataSource.releaseConnection(conn);
            return ret;
          }
        };
      }
```

Code fragememt:

```
  addUser(){
      var me = this;
      return function *(){

        try {
          var newId = 0;
          var ret = {};
          var body = this.request.body;
          var model = new User();
          var conn = yield me.app.dataSource.getConnection();

          model.merge( Object.assign( body, {createtime:Date.now(), updatetime:Date.now()} ) );

          var record = yield conn.create(model);
          newId = record.insertId;
          ret = me.APIReturn(0,'success',{id:newId});
        } catch (e) {
          EasyNode.DEBUG && logger.error(e);
          ret = me.APIReturn(1,'failed',{});
        } finally {
          yield me.app.dataSource.releaseConnection(conn);
          return ret;
        }
      }
    }

    updateUser(id){
      var me = this;
      return function *(){

        try {
          var ret = {};
          var body = this.request.body;
          var model = new User();
          var conn = yield me.app.dataSource.getConnection();

          model.merge( Object.assign( body, {id:id, updatetime:Date.now()} ) );

          var record = yield conn.update(model);
          ret = me.APIReturn(0,'success',{id: id});
        } catch (e) {
          EasyNode.DEBUG && logger.error(e);
          ret = me.APIReturn(1,'failed',{});
        } finally {
          yield me.app.dataSource.releaseConnection(conn);
          return ret;
        }
      }
    }

      getUser(id){
        var me = this;
        return function *(){

          try {
            var ret = {};
            var record = null;
            var sql = '';
            var arr = [];
            var id2 = id || 0 ;
            var conn = yield me.app.dataSource.getConnection();

            sql = 'SELECT id,account,accountid,email, phonenumber,salt,passwordsha,createtime, updatetime FROM monitor_user WHERE id = #id#';
            arr = yield conn.execQuery( sql, {id:id2} );
            if (arr.length <= 0) {
              return ret;
            }
            record = arr[0];
            ret = me.APIReturn(0,'success',record);
          } catch (e) {
            EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
            ret = me.APIReturn(1,'fail',{});
          } finally {
            yield me.app.dataSource.releaseConnection(conn);
            return ret;
          }
        }
      }

      getUserList(index,pagesize){
        var me = this;
        return function *(){
            try {
              var ret = {};
              var model = new User();
              var conn = yield me.app.dataSource.getConnection();

              var data = yield conn.list(model,{id: {exp:'!=',value:0} }, {page: index, rpp: pagesize}, ['updatetime ASC']);

              ret = me.APIReturn(0,'success',data);
            } catch (e) {
              EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
              ret = me.APIReturn(1,'fail',{});
            } finally {
              yield me.app.dataSource.releaseConnection(conn);
              return ret;
            }
          };
      }

      delUser(id){
        var me = this;
        return function *(){

        try {
            var ret = {};
            var model = new User();
            var conn = yield me.app.dataSource.getConnection();

            var data = yield conn.del(model,[id]);
            //{ affectedRows: 1, insertId: 0 }
            ret = me.APIReturn(0,'success',{id: id});
          } catch (e) {
            EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
            ret = me.APIReturn(1,'fail',{});
          } finally {
            yield me.app.dataSource.releaseConnection(conn);
            return ret;
          }
        };
      }
```

### Uniform return format


```
{
	resCode: 0,
	resReason: '',
	data: {
	}
}
```

* resCode:  as a return code(subsection)
* resReason: the message according to resCode
* data: object that package business data


### RDS Config

```
"mysql":{
    "host": "",
    "port": 3306,
    "user": "",
    "password": "",
    "database": "",
    "acquireTimeout": "10000",
    "waitForConnections" : true,
    "connectionLimit" :  10,
    "queueLimit" : 10000
  }
```

### Run the Demo

```
cd bin;
CONFIG_URL='../config/config.json' sh dev_start.sh

```

### Test

in the file test/src/UserTest.js.

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

```

```
cd ..
npm test
```

### Transaction operation

Trasaction Operation Template:

```
	buySomething(){
		var me = this;
		return function *(){
			try{
				var ret = {};

				var conn = yield me.app.dataSource.getConnection();
				yield* conn.beginTransaction()();

				....
				yield* conn.commit()();
			}catch(e){
				EasyNode.DEBUG && logger.debug(` ${e},${e.stack}`);
                yield* conn.rollback()();
			}finally{
				yield me.app.ds.releaseConnection(conn);
				return ret;
			}
		}
	}
```
### Multiple table correlation operation

It is saying that about Multiple table correlation operation is not as convenient as `sequelize`, so we ask you to be very proficient in SQL language, and all the SQL related statements to put in the same file.

Mainly focus on the use of the following two interfaces:

```
execQuery(sql, args = {})
execUpdate(sql, args = {})
```
## In the future.


ToDO: parameter validation and response validation based on JSON-Schema.


## Checkout code

check out the code.

```
git clone https://github.com/easynode/easynode-template.git

git branch -r   //show remote branchs

git checkout origin/rds
```