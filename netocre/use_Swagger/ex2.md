明白了——你是在 Docker 里运行 .NET Core 3.0 WebAPI，对外调用第三方 HTTPS 报

The SSL connection could not be established …

这在容器里 90% 是 根证书缺失 / 证书链不完整，其次是 HTTP/2 兼容 或 TLS 协议。直接给你一套“容器侧 + 代码侧”一次性修好方案。

1) 先把镜像装上根证书（最关键）

Debian/Ubuntu 基础镜像（aspnet:3.0/3.1 常见）

# 运行镜像（示例：mcr.microsoft.com/dotnet/core/aspnet:3.1）
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

# 安装根证书包（ca-certificates）
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
 && update-ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# （可选）如果你公司有代理根证书，复制进来并更新信任库
# COPY corp-root.crt /usr/local/share/ca-certificates/corp-root.crt
# RUN update-ca-certificates
WORKDIR /app
COPY ./publish/ ./
ENTRYPOINT ["dotnet", "YourApp.dll"]

Alpine 基础镜像（aspnet:3.0-alpine）

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine

RUN apk add --no-cache ca-certificates \
 && update-ca-certificates

# （可选）公司根证书
# COPY corp-root.crt /usr/local/share/ca-certificates/corp-root.crt
# RUN update-ca-certificates

WORKDIR /app
COPY ./publish/ ./
ENTRYPOINT ["dotnet", "YourApp.dll"]

说明
	•	必须把根证书装进运行镜像（不是只在 build 阶段）。
	•	如果你的公司网关做了 HTTPS 检查（替换证书），把 公司根证书 放入容器并 update-ca-certificates。
	•	只用“忽略证书验证”调试即可，不要放生产。

2) 代码侧加两项兜底（常见兼容问题）

在你封装的 HttpClient（推荐命名客户端）里：

// Startup.ConfigureServices (.NET Core 3.0)
services.AddHttpClient("ThirdParty", c =>
{
    c.Timeout = TimeSpan.FromSeconds(30);
})
.ConfigurePrimaryHttpMessageHandler(() =>
{
    return new HttpClientHandler
    {
        // 一些老服务只接受 TLS1.2
        SslProtocols = System.Security.Authentication.SslProtocols.Tls12
        // 仅定位用：彻底忽略证书（请勿生产）：
        // ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    };
});

调用时，若遇到 HTTP/2 兼容问题，强制走 HTTP/1.1：

var client = _factory.CreateClient("ThirdParty");
var req = new HttpRequestMessage(HttpMethod.Post, url)
{
    Version = System.Net.HttpVersion.Version11   // 关键：禁用 H2
};
var res = await client.SendAsync(req);

也可全局关闭 H2（仅需临时排障时）：
	•	环境变量：DOTNET_SYSTEM_NET_HTTP_SOCKETSHTTPHANDLER_HTTP2SUPPORT=false
	•	或在启动时：AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2Support", false);

3) 容器里自检（定位更快）

进入容器看证书/协议是否正常：

# 进入容器
docker exec -it <container> sh   # 或 bash

# 看根证书是否存在（Debian）
ls -l /etc/ssl/certs/ca-certificates.crt

# 用 curl 直连目标域名
apk add curl || apt-get update && apt-get install -y curl
curl -v https://your.api.example.com/health

# 看证书链（安装 openssl 后）
openssl s_client -connect your.api.example.com:443 -servername your.api.example.com -alpn h2,http/1.1 </dev/null

	•	若 curl 报 certificate verify failed → 证书信任问题，把根/中间证书装入容器即可。
	•	若仅在 -alpn h2 时挂、http/1.1 正常 → HTTP/2 兼容问题，按上一步降级。

4) 需要双向 TLS（mTLS）时

把客户端证书以 Secret/挂载 方式给容器，并在代码里加载：

var handler = new HttpClientHandler();
var cert = new X509Certificate2("/app/certs/client.pfx", "pfx密码", X509KeyStorageFlags.MachineKeySet);
handler.ClientCertificates.Add(cert);
var client = new HttpClient(handler);

注意容器内文件权限：chmod 600 /app/certs/client.pfx，避免因权限导致读取失败。

5) 常见坑位清单
	•	镜像没装证书 ➜ apt-get install ca-certificates / apk add ca-certificates 并 update-ca-certificates。
	•	公司代理根证书 没进容器 ➜ COPY 到 /usr/local/share/ca-certificates/ 后 update-ca-certificates。
	•	用 IP 访问 导致证书域名不匹配 ➜ 换成证书上的域名（SNI）。
	•	HTTP/2 实现不兼容 ➜ 对该目标 RequestMessage.Version = Version11。
	•	系统时间不准 ➜ 容器里同步时间（尤其 Alpine）。

⸻

如果你愿意贴出：基础镜像名（alpine 还是 debian）、是否有公司代理根证书、一段最小的 Dockerfile，我可以直接把它改成“可复制即用”的最终版本。






/////////////////////

看结果一目了然：
	•	tcp xx.xx.xx.xx:8500 47/consul → Consul HTTP 正常（8500）
	•	tcp xx.xx.xx.xx:8600 47/consul → Consul DNS 正常（8600）
	•	tcp 0.0.0.0:8080 47/dotnet → .NET 仍在全零地址监听，需要改
	•	tcp6 :::84221 47/consul → Consul 还有一个动态端口在 IPv6 任意地址监听（大概率是 sidecar/proxy 动态端口）

下面给你最小改动的两处整改，直接替换即可。

⸻

① 修 .NET 监听（消除 0.0.0.0:8080）

在 start.sh 里，起 dotnet 前加入（或覆盖已有设置）：

# 获取容器 IPv4
Container_IP="$(ip -o -4 addr show eth0 | awk '{print $4}' | cut -d/ -f1)"

# 显式绑定到容器 IP（跨容器可达，且不再是 0.0.0.0）
APP_PORT=${APP_PORT:-8080}
export ASPNETCORE_URLS="http://${Container_IP}:${APP_PORT}"

exec dotnet xxx.dll

这会把 Kestrel 绑定到 Container_IP:8080，netstat 不会再出现 0.0.0.0:8080。

⸻

② 修 Consul 动态端口的 :::（84221）

这是 Connect/Sidecar 动态端口在“IPv6 任意地址”上监听。两种做法任选其一：

方案 A（推荐）：固定动态端口区间 + 绑定到容器 IPv4

把你现有的 client_policy.json 加上下面几段（不新增文件）：

{
  "...": "...",

  "client_addr": "{ip}",
  "addresses": {
    "http": "{ip}",
    "https": "{ip}",
    "grpc": "{ip}",
    "dns": "{ip}"
  },
  "ports": {
    "http": 8500,
    "dns": 8600,

    "https": -1,
    "grpc": -1,

    "serf_lan": 8301,

    "sidecar_min_port": 20000,
    "sidecar_max_port": 20100
  }
}

	•	{ip} 用启动脚本替换为容器 IPv4：

sed -i "s|{ip}|${Container_IP}|g" ./consul/config/client_policy.json


	•	这样 sidecar 动态端口只会落在 20000–20100，并且绑定到容器 IPv4，不会再出现 tcp6 :::xxxxx。
	•	https/grpc 如不用就 -1 禁用；dns 你现在确实在用（8600），所以保留。

方案 B（不用 Connect）：直接禁用 sidecar 动态端口

如果你没有使用 Consul Connect / Sidecar / Envoy，直接关闭：

"ports": {
  "http": 8500,
  "dns": 8600,

  "https": -1,
  "grpc": -1,

  "serf_lan": 8301,

  "sidecar_min_port": -1,
  "sidecar_max_port": -1
}

这会彻底消灭那条 tcp6 :::84221（也不会再起任何 sidecar 动态监听）。

启动命令务必带上（关键）：

确保 consul agent 命令显式用容器 IPv4 绑定 gossip：

consul agent \
  -node=service_name \
  -advertise="${VMIP:-$Container_IP}" \
  -bind="$Container_IP" \
  -client="$Container_IP" \
  -config-dir=./consul/config \
  -serf-lan-port=8301 \
  > /tmp/consul.log 2>&1 &

-bind=$Container_IP + 配置里 "serf_lan": 8301 能保证 serf 也不会落在 ::。

⸻

验证

容器内执行：

ss -lntp | egrep 'consul|dotnet'

期望：
	•	xx.xx.xx.xx:8500 consul
	•	xx.xx.xx.xx:8600 consul（或你禁用了就没有）
	•	xx.xx.xx.xx:8301 consul
	•	xx.xx.xx.xx:8080 dotnet
	•	不再出现 tcp6 :::84221 consul 或 0.0.0.0:8080 dotnet

⸻

小贴士
	•	仍想保留 IPv6，但避免任意地址：把 {ip} 换成具体 IPv6 或 ::1，不要用 ::。
	•	如果你确实需要 Connect/Sidecar，请务必使用固定区间（如 20000–20100），否则安全扫描会反复扫到不同高位端口。

如果你把当前 client_policy.json 发我（去掉敏感值），我按你是否需要 DNS/Connect 直接给你“可粘贴版”最终配置。