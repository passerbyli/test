Container_IP = `ifconfig eth0 | grep 'inet ' | awk '{print $2}'`
SerfLanPort = `echo ${VMPORT}|awk -F ':' '{print $2}'`


sed -i 's/{token}/'"${AGENT_TOKEN}"'/g' "./consul/config/client_policy.json"
sed -i 's/{server}/'"${CONSUL_SERVER}"'/g' "./consul/config/client_policy.json"


chmod +x xxx.dll
consul agent -node=service_name -advertise $VMIP -client $Container_IP  -config-dir=./consul/config/client_policy.json -serf-lan-port $SerfLanPort & dotnet xxx.dll