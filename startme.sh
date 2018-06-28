#!/bin/bash
echo "hello starting shotspy!"

#killall node
kill $(ps aux | grep '[n]ode shotspy-server' | awk '{print $2}')
#node shotspy-server.js > shotspy-server.log &
forever -o out.log -e err.log start shotspy-server.js > shotspy-server.log

echo "done shotspy forever!"