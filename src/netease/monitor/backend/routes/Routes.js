'use strict'

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var thunkify = require('thunkify');
import bodyParse from 'koa-body';

import Controllers from '../controllers/Controllers';


(function () {
    /**
     * Class Routes
     *
     * @class netease.monitor.routes.Routes
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

            httpServer.addMiddleware(bodyParse());

            httpServer.addTemplateDirs('plugins/views');
        }

        static addRoute(httpServer)
        {
            httpServer.addRoute('get', '/', Controllers.home(httpServer));
            httpServer.addRoute('post', '/upl', Controllers.upload(httpServer));

            // User
            httpServer.addRoute('post','/user', Controllers.addUser(httpServer));
            httpServer.addRoute('get','/add/user', Controllers.addUserPage(httpServer));
            httpServer.addRoute('put','/user/:id',Controllers.updateUser(httpServer));
            httpServer.addRoute('get','/user/:id',Controllers.getUser(httpServer));
            httpServer.addRoute('get','/user/:index/:pagesize',Controllers.getUserlist(httpServer));
            httpServer.addRoute('delete','/user/:id',Controllers.delUser(httpServer));
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports  = Routes;
})();
