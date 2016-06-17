#!/bin/sh

#arg1 -> Service Name
#arg2 -> Service HTTP port

startService() {
        echo "starting  service [$1],  HTTP port: [$2]"

        babel-node --harmony main.js --debug-output=true --http.server.port=$2 --src-dirs=src --main-class=netease.monitor.backend.Main --config-files=config/service.conf  --easynode.app.id=$1
}

echo 'starting netease.monitor servers...'

#################netease.monitor backend Servers START##############
sleep 1
startService 'netease.monitor' 8899
#################netease.monitor backend Servers END#########################
echo 'netease.monitor backend servers started!'


