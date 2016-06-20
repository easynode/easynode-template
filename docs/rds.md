

## Templates

###  Model

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
         * 定义模型字段
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

route template

```
httpServer.addRoute('post','/${MODEL}', Controllers.add${MODEL}(httpServer));
httpServer.addRoute('/${MODEL}/user', Controllers.add${MODEL}Page(httpServer));
httpServer.addRoute('put','${MODEL}/:id',Controllers.update${MODEL}(httpServer));
httpServer.addRoute('get','${MODEL}/:id',Controllers.get${MODEL}(httpServer));
httpServer.addRoute('post','${MODEL}/:index/:pagesize',Controllers.get${MODEL}list(httpServer));
httpServer.addRoute('delete','${MODEL}/:id',Controllers.del${MODEL}(httpServer));
```

Controller template

