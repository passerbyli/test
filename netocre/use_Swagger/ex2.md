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