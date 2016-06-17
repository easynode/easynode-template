
#!/bin/sh

#arg1 -> Service Name
#arg2 -> Service HTTP port

startService() {
        echo "starting  service [$1],  HTTP port: [$2]"

        source /root/.bashrc
        node main.min.js --debug-output=true --http.server.port=$2 --src-dirs=lib --main-class=netease.monitor.backend.Main --config-files=config/service.conf  --easynode.app.id=$1
}

echo 'starting netease.monitor servers...'

#################netease.monitor backend Servers START##############
sleep 1
startService 'netease.monitor' $PORT
#################netease.monitor backend Servers END#########################
echo 'netease.monitor backend servers started!'

