看到了：.NET Core 3.0 发起 HTTPS 时抛 The SSL connection could not be established, see inner exception，常见就是 证书链/信任、TLS/套件、HTTP/2 兼容、SNI/域名、或 需要双向证书（mTLS）。下面给你一套“最小改动→逐项定位”的操作清单与代码。

1) 先快速验证是哪一类问题

把下面这段一次性测试代码跑一下（建议临时 Console 项目/最小复现里）：

using System;
using System.Net.Http;
using System.Net.Security;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var handler = new HttpClientHandler
        {
            // ① 强制 TLS1.2（很多老服务只接受 1.2）
            SslProtocols = SslProtocols.Tls12,

            // ② 临时打印证书链 & 只用于定位（请勿生产忽略验证）
            ServerCertificateCustomValidationCallback = (req, cert, chain, errors) =>
            {
                Console.WriteLine($"Subject={cert?.Subject}");
                Console.WriteLine($"Issuer={cert?.Issuer}");
                Console.WriteLine($"Errors={errors}");
                if (chain != null)
                {
                    foreach (var s in chain.ChainElements)
                        Console.WriteLine($"  -> {s.Certificate.Subject}");
                }
                // 仅定位时返回 true；若返回 false 可看到更准确的错误
                return true;
            }
        };

        using var client = new HttpClient(handler);
        // ③ 降级 HTTP/2（服务端 H2 兼容差时很有用）
        var req = new HttpRequestMessage(HttpMethod.Get, "https://你的目标域名/health");
        req.Version = System.Net.HttpVersion.Version11;

        try
        {
            var res = await client.SendAsync(req);
            Console.WriteLine($"Status={res.StatusCode}");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            Console.WriteLine(ex.InnerException); // 关键！
        }
    }
}

	•	如果 加了 return true 就能通：基本确定是证书信任链问题（见第 2 步）。
	•	如果 **加了 Tls12 或 强制 HTTP/1.1 后就正常：分别是 TLS/HTTP2 兼容问题（见第 3 步）。
	•	如果 仍然失败，看 console 打印的 Errors：
	•	RemoteCertificateNameMismatch：SNI/域名不匹配（见第 4 步）
	•	RemoteCertificateChainErrors：链条缺中间/根证书（见第 2 步）
	•	RemoteCertificateNotAvailable：对方要 mTLS（见第 5 步）

⸻

2) 证书链/信任问题（最常见）

现象：上面打印里 Errors=RemoteCertificateChainErrors，或忽略验证后才通。
修复：
	•	Linux / 容器：安装根证书包并更新信任库
	•	Debian/Ubuntu：apt-get update && apt-get install -y ca-certificates && update-ca-certificates
	•	Alpine：apk add --no-cache ca-certificates && update-ca-certificates
	•	公司代理做 HTTPS 检查：把公司代理根证书导入系统“受信任的根证书颁发机构”（Windows）或 /usr/local/share/ca-certificates/*.crt + update-ca-certificates（Linux）。
	•	服务端缺中间证书：让对方补齐中间证书（浏览器“锁”里导出的链要完整）。

临时绕过只用于定位，不要放生产：

handler.ServerCertificateCustomValidationCallback =
    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;



⸻

3) 协议/HTTP2 兼容问题
	•	强制 TLS 1.2（不少老服务只接受 1.2）：

handler.SslProtocols = SslProtocols.Tls12;


	•	强制 HTTP/1.1（很多“宣称支持 H2”的服务实现不完整）：

var req = new HttpRequestMessage(HttpMethod.Post, url) { Version = System.Net.HttpVersion.Version11 };


	•	（可选）全局命名 HttpClient：

services.AddHttpClient("ThirdParty")
  .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { SslProtocols = SslProtocols.Tls12 });



⸻

4) 域名/SNI 不匹配

现象：RemoteCertificateNameMismatch，或你用 IP/自定义 Host 访问。
修复：改用与证书 CN/SAN 匹配的域名访问；反向代理要透传 SNI（Host）。

⸻

5) 对方需要双向 TLS（mTLS）

现象：RemoteCertificateNotAvailable 或服务端日志说需要客户端证书。
修复：加载客户端证书（PFX）：

var handler = new HttpClientHandler();
var clientCert = new X509Certificate2("client.pfx", "你的密码", X509KeyStorageFlags.MachineKeySet);
handler.ClientCertificates.Add(clientCert);


⸻

6) 代理 & 时间问题
	•	公司代理：设置代理，否则 CONNECT 握手会失败。

handler.Proxy = new WebProxy("http://proxy.company:8080");
handler.UseProxy = true;


	•	系统时间不准：证书“未生效/已过期”也会触发 SSL 失败。同步 NTP。

⸻

7) 把修复固化到你的 WebAPI

在 Startup.ConfigureServices 里配置命名客户端（推荐）：

services.AddHttpClient("ThirdParty", c =>
{
    c.Timeout = TimeSpan.FromSeconds(30);
})
.ConfigurePrimaryHttpMessageHandler(() =>
{
    return new HttpClientHandler
    {
        SslProtocols = System.Security.Authentication.SslProtocols.Tls12,
        // 生产环境不要忽略验证；确实需要公司根证书时，把根证书装到系统信任库
        // ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    };
});

调用时若遇到 H2 问题：

var client = _factory.CreateClient("ThirdParty");
var req = new HttpRequestMessage(HttpMethod.Get, url) { Version = System.Net.HttpVersion.Version11 };
var res = await client.SendAsync(req);


⸻

**如果你能提供：**运行环境（Windows/Linux/容器）、是否走公司代理、目标域名（可打码）、以及前面测试代码里打印到的 Errors/证书链，我可以直接给你“最小可改动”的最终版本（比如：仅需装 ca-certificates、或仅需降到 HTTP/1.1、或加上客户端证书）。