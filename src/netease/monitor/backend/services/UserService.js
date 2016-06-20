'use strict';
var assert = require('assert');
var Mixin = using('easynode.framework.Mixin');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var User = using('netease.monitor.backend.models.User');
var APIReturn =  using('easynode.framework.util.APIReturn');

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
  class UserService extends Mixin.mix(GenericObject,APIReturn) {
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

    getClassName() {
      return EasyNode.namespace(__filename);
    }
  }

  module.exports = UserService;
})();

