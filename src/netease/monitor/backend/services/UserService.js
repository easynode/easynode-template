'use strict';
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var User = using('netease.monitor.backend.models.User');

(function() {

    /**
     * Class UserService
     *
     * @class netease.monitor.backend.services.UserService
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * @description
     * */
  class UserService extends GenericObject {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
    constructor(app, config = {}) {
      super();
            // 调用super()后再定义子类成员。
      this.app = app;
    }


    addUser(){
      var me = this;
      return function *(){
        var newId = 0;
        try {
          var conn = yield me.app.dataSource.getConnection();

          var body = this.request.body;

          var model = new User();
          model.merge( Object.assign( body, {createtime:Date.now(), updatetime:Date.now()}  ) );

          var record = yield conn.create(model);
          newId = record.insertId;
        } catch (e) {
          EasyNode.DEBUG && logger.error(e);
        } finally {
          yield me.app.dataSource.releaseConnection(conn);
          return { id: newId };
        }
      }
    }

    updateUser(id){
      var me = this;
      return function *(){
        var newId = 0;
        try {
          var conn = yield me.app.dataSource.getConnection();

          console.log("updateUser");

          var body = this.request.body;
          console.log(body);

          var model = new User();
          model.merge( Object.assign( body, {id:id,createtime:Date.now(), updatetime:Date.now()}  ) );

          var record = yield conn.update(model);
          newId = record.insertId;
        } catch (e) {
          EasyNode.DEBUG && logger.error(e);
        } finally {
          yield me.app.dataSource.releaseConnection(conn);
          return { id: newId };
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

            console.log("aaa");
            console.log(this.parameter);
            console.log(this.body);
            console.log(this.query);
            var id = id || 0;
            var conn = yield me.app.dataSource.getConnection();

            sql = 'SELECT id,account,accountid,email, phonenumber,salt,passwordsha,createtime, updatetime FROM monitor_user WHERE id = #id#';
            arr = yield conn.execQuery( sql, {id:id} );
            if (arr.length <= 0) {
              return ret;
            }
            record = arr[0];

            ret.record = record;
          } catch (e) {
            EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
          } finally {
            yield me.app.dataSource.releaseConnection(conn);
            return ret;
          }
        }
      }

      getUserList(index,pagesize){
        var me = this;
        return function *(){
          console.log(`***********index:${index},pagesize:${pagesize}`);
          return "userinfoList";
        }
      }

      delUser(id){
        var me = this;
        return function *(){
          console.log("delUser:id",id);
          return "del user success";
        }
      }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
  }

  module.exports = UserService;
})();

