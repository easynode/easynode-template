var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var fs = require('co-fs');
var FileService =  using('easynode.framework.util.FileService');
var multipart = require('co-multipart');
var f =  require('fs');
var util = require('util');
var thunkify = require('thunkify');
var StoreService = using('netease.monitor.backend.services.StoreService');

(function () {
    /**
     * Class Controllers
     *
     * @class netease.monitor.Controllers
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
         * @apiSampleRequest http://127.0.0.1:8899/upl/

         * @apiSuccess {String} url NOS_URL
         *
         * @apiUse
         */
        static upload(app) {
            var supportFileTypes = '^.*.(?:jpg|png|gif)$';
            var regEx = new RegExp(supportFileTypes);

            return function *() {

                var key = this.query.key || 'undefined';

                var session = this.session;
                this.state.upload = 0;
                if (this.method.toLocaleLowerCase() == 'post') {
                    var hasError = false;
                    var filename = '';
                    var url = '';
                    var parts = yield* multipart(this);
                    for (const file of parts.files) {
                        if (file.filename.match(regEx)) {
                            var storeService = new StoreService(app);
                            url = yield storeService.uploadNos(key, file.path);
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

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Controllers;
})();
