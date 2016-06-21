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
var UserService =  using('netease.monitor.backend.services.UserService');

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
         * @apiDefine APIReturn
         * @apiSuccess
         * @apiError
         *
         * @apiErrorExample :
         *      {resCode:1, resReason:'failed', data:{} }
         * @apiSuccessExample:
         *     {"resCode":0,"resReason":"success","data":{"rows":1,"pages":1,"page":"0","rpp":"20","data":[{"id":1,"account":"hujb2000@163.com","accountid":"allen.hu","email":"hujb2000@163.com","phonenumber":"*****","salt":"12345","passwordsha":"1234561213123","createtime":1466410666309,"updatetime":1466410666309}]}}
         * */

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


        static getSession(app){
            return function *(id){

                var session = this.session;
                session.count = session.count || 0;
                session.count++;

                this.type = 'json';
                this.body = session.count;
            };
        }

        static delSession(app){
            return function *(id){

                this.session = null;

                this.type = 'json';
                this.body = 0;
            };
        }


        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Controllers;
})();
