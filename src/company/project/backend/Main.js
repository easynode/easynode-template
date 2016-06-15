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

            httpServer.name = EasyNode.config('http.server.name','{COMPANY}-{PROJECT}-Service');
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