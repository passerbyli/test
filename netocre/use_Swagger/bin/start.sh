#!/bin/sh
set -euo pipefail




# 容器里证书路径（挂载进来）
CERT_PATH=/app/certs/site.pfx
CERT_PASSWORD=yourpwd

# 用环境变量告诉 Kestrel
export ASPNETCORE_Kestrel__Endpoints__Https__Url="https://0.0.0.0:8443"
export ASPNETCORE_Kestrel__Endpoints__Https__Certificate__Path="$CERT_PATH"
export ASPNETCORE_Kestrel__Endpoints__Https__Certificate__Password="$CERT_PASSWORD"


# 取容器 IPv4
Container_IP="$(ip -o -4 addr show eth0 | awk '{print $4}' | cut -d/ -f1)"

# 固定 serf lan 端口（不要动态随机）
SerfLanPort="${VMPORT:-8301}"
SerfLanPort="$(echo "$SerfLanPort" | awk -F ':' '{print $2}')"

CFG="./consul/config/client_policy.json"

# 替换占位符
sed -i "s/{token}/${AGENT_TOKEN}/g" "$CFG"
sed -i "s|{server}|${CONSUL_SERVER}|g" "$CFG"
sed -i "s|{ip}|${Container_IP}|g" "$CFG"
sed -i "s|{serf_lan}|${SerfLanPort}|g" "$CFG"

# 启动 Consul，显式指定 -bind 和 -client
consul agent \
  -node=service_name \
  -advertise="${VMIP:-$Container_IP}" \
  -bind="$Container_IP" \
  -client="$Container_IP" \
  -config-dir=./consul/config \
  > /tmp/consul.log 2>&1 &

# 起 .NET 服务，绑定到容器 IP
APP_PORT=${APP_PORT:-8080}
export ASPNETCORE_URLS="http://${Container_IP}:${APP_PORT}"
exec dotnet xxx.dll