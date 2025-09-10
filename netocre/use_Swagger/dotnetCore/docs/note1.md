谢谢，這个结果很清楚地指向“系统信任库不完整”。你容器里只有 4 个证书（/etc/ssl/certs 里 2 个、/etc/pki/ca-trust/source/anchors 里 2 个），而正常应是几百个。因此 .NET 校验证书时直接报：

The remote certificate is invalid according to the validation procedure.

下面按你这种目录结构（说明是 RHEL/CentOS/Alma/Rocky/UBI 系）给出最小修复方案。

1) 立刻在运行中的容器里验证/修复（临时）

# 进入容器后执行（有 root 权限）
# 安装根证书包
( command -v dnf >/dev/null && dnf install -y ca-certificates ) \
|| ( command -v yum >/dev/null && yum install -y ca-certificates ) \
|| ( command -v microdnf >/dev/null && microdnf install -y ca-certificates )

# 启用并抽取到系统信任库
update-ca-trust force-enable
update-ca-trust extract

# 如需导入公司根证书（PEM 文本）：
# 将 corp-root.pem 放到 anchors 目录并重新抽取
# cp /tmp/corp-root.pem /etc/pki/ca-trust/source/anchors/corp-root.crt
# update-ca-trust extract

# 快速自检：数量应显著上升（通常数百）
ls -1 /etc/ssl/certs | wc -l

# 用 curl 再测目标域名（可替换为你真实域名）
curl -v https://your.api.example/ -o /dev/null

若 curl -v 成功，大概率 .NET 也会恢复正常；若 curl 仍报 “certificate verify failed”，要么公司根证书没导入，要么目标站点链不完整（需对方补中间证书）。

2) 把修复固化进镜像（推荐）

确保每次部署都带上完整信任库与公司根证书。

# 以 UBI / RHEL 系为例
FROM registry.access.redhat.com/ubi8/ubi-minimal  # 或你当前的 aspnet 基础镜像

# 安装 CA 包并启用信任库
RUN microdnf install -y ca-certificates && microdnf clean all \
&& update-ca-trust force-enable && update-ca-trust extract

# 若需公司根证书，复制进 anchors 并抽取
# COPY corp-root.pem /etc/pki/ca-trust/source/anchors/corp-root.crt
# RUN update-ca-trust extract

# …其余应用层内容

Debian/Ubuntu 基镜像：apt-get install -y ca-certificates && update-ca-certificates
Alpine：apk add --no-cache ca-certificates && update-ca-certificates

3) 常见坑位 & 快速判别
   •	文件后缀/格式：放进 anchors 的应是 PEM 文本，后缀用 .crt；DER/PKCS12 会被忽略。
   •	只复制了公司根，但没装公共根：很多公网站点仍需公共根链；务必同时安装 ca-certificates 包。
   •	导入后没抽取：导入 anchors 后一定要 update-ca-trust extract（Deb/Alpine 是 update-ca-certificates）。
   •	用 IP 访问：证书域名不匹配会继续失败；务必用与证书 CN/SAN 匹配的 域名。
   •	服务端链不完整：openssl s_client -connect host:443 -servername host -showcerts 看是否缺中间证书；让对方补齐。

4) 应用侧可保留的“保险丝”（可选）

即使修好信任库，也建议对“兼容性问题”留兜底：

// 只演示关键行，保持你现有的 HttpClient 工厂结构
services.AddHttpClient("ThirdParty")
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
SslProtocols = System.Security.Authentication.SslProtocols.Tls12
// 生产环境不要忽略证书验证！
// ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
});

调用时，如遇个别服务的 HTTP/2 兼容问题：

var client = _factory.CreateClient("ThirdParty");
var req = new HttpRequestMessage(HttpMethod.Get, url)
{
Version = System.Net.HttpVersion.Version11 // 强制 HTTP/1.1
};
var res = await client.SendAsync(req);

5) 用你现有的 /_sslcheck 再确认

修完后再 POST 你加过授权/参数的 /_sslcheck：
•	ContainerCertStats.TotalFiles 应明显上升；
•	Steps.default 应成功（或至少 force_tls12 / force_http11 其中之一成功）；
•	InferredIssues 不再提示 “根证书数量异常偏少”。

⸻

需要的话你把基础镜像名贴一下（如 mcr.microsoft.com/dotnet/aspnet:3.0-... 或 UBI/Alpine 具体 tag），我给你提供对应发行版的精简 Dockerfile 和 公司根证书自动导入的最佳实践片段。