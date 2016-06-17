'use strict';
var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Nos = require('nenos');

(function() {

    /**
     * Class StoreService
     *
     * @class netease.monitor.backend.services.StoreService
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * @description
     * */
  class StoreService extends GenericObject {
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

    getClassName() {
      return EasyNode.namespace(__filename);
    }
  }

  module.exports = StoreService;
})();

