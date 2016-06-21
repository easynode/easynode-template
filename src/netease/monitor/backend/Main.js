var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var thunkify = require('thunkify');
var Routes = using('netease.monitor.backend.routes.Routes');
var MySqlDataSource = using('easynode.framework.db.MysqlDataSource');
var HTTPUtil =  using('easynode.framework.util.HTTPUtil');
var fs = require('co-fs');
import bodyParse from 'koa-body';
import rateLimit from 'koa-ratelimit';
import redis from 'redis';

(function () {
    /**
     * Class Main
     *
     * @class netease.monitor.backend.Main
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

            var configUrl = process.env.CONFIG_URL;
            var config = {};
            if( configUrl.startsWith('http') ){
                config = yield HTTPUtil.getBinary(configUrl);
            } else {
                config = yield fs.readFile(configUrl,'utf8');
            }
            config = JSON.parse(config);

            // Database source, connection pool
            var dataSource = new MySqlDataSource();
            dataSource.initialize(config.mysql);


            //HTTP Server
            var KOAHttpServer =  using('easynode.framework.server.http.KOAHttpServer');
            var httpPort = S(EasyNode.config('http.server.port','7000')).toInt();
            var httpServer = new KOAHttpServer(httpPort);

            httpServer.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_REDIS, config.redis );

            // assign env config to application object
            httpServer.config = config;

            // assign dataSource to application object
            httpServer.dataSource = dataSource;

            //设置ContextHook,
      httpServer.setActionContextListener({
        onCreate: function(ctx) {
          return function *() {
            ctx.setConnection(yield ds.getConnection());
            yield ctx.getConnection().beginTransaction();
          };
        },
        onDestroy: function(ctx) {
          return function *() {
            yield ctx.getConnection().commit();
            yield ds.releaseConnection(ctx.getConnection());
          };
        },

        onError: function(ctx, err) {
          return function *() {
            yield ctx.getConnection().rollback();
            !err.executeResult && logger.error(err.stack);
          };
        }
      });

            httpServer.name = EasyNode.config('http.server.name','netease-monitor-Service');
            Routes.defineRoutes(httpServer);
            httpServer.addMiddleware(bodyParse());
            httpServer.addMiddleware(rateLimit({
                db:redis.createClient(config.redisRatelimit),
                duration:60000,
                max:100,
                id: function(context){
                    return context.url;
                },
                headers:{
                    remaining: 'Rate-Limit-Remaining',
                    reset: 'Rate-Limit-Reset',
                    total: 'Rate-Limit-Total'
                }
            }));
            httpServer.addTemplateDirs('plugins/views');
            yield httpServer.start();
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Main;
})();
