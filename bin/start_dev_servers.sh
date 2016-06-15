#!/bin/sh

#arg1 -> Service Name
#arg2 -> Service HTTP port

startService() {
        echo "starting  service [$1],  HTTP port: [$2]"

        babel-node --harmony main.js --debug-output=true --http.server.port=$2 --src-dirs=src --main-class={COMPANY}.{PROJECT}.backend.Main --config-files=config/service.conf  --easynode.app.id=$1
}

echo 'starting {COMPANY}.{PROJECT} servers...'

#################{COMPANY}.{PROJECT} backend Servers START##############
sleep 1
startService '{COMPANY}.{PROJECT}' {PORT}
#################{COMPANY}.{PROJECT} backend Servers END#########################
echo '{COMPANY}.{PROJECT} backend servers started!'


