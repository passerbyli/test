namespace dotnetCore.Model;

public class SecurityOptions
{
    // ====== 大请求限制 ======
    public bool EnableRequestSizeLimit { get; set; } = true;
    public long MaxRequestBodySizeBytes { get; set; } = 256 * 1024; // 256KB

    // ====== XSS 请求过滤 ======
    public bool EnableXssRequestFilter { get; set; } = true;
    /// <summary>只扫描前 N 字节，避免超大包体导致过高 CPU 消耗</summary>
    public int XssScanBytesLimit { get; set; } = 64 * 1024; // 64KB

    /// <summary>命中规则时的动作：Reject / Sanitize</summary>
    public string XssAction { get; set; } = "Reject";

    /// <summary>仅对这些 Content-Type 扫描（逗号分隔，大小写不敏感，包含判断）</summary>
    public string XssContentTypes { get; set; } = "application/json,application/x-www-form-urlencoded,text/plain";

    /// <summary>是否忽略大小写</summary>
    public bool XssCaseInsensitive { get; set; } = true;

    /// <summary>危险关键字（正则或简单包含匹配）。逗号分隔。</summary>
    public string XssDangerTokens { get; set; } =
        "<script,</script,</ script,script>,javascript:,onerror=,onload=,onfocus=,onmouseover=,<img,src=,document.cookie,</iframe,</ object,</embed";
    
    // ====== Origin 校验 ======
    public bool EnableOriginValidation { get; set; } = true;

    /// <summary>允许的 Origin 列表（必须包含 scheme，如 http://localhost:8080）</summary>
    public string[] AllowedOrigins { get; set; } = new string[0];

    /// <summary>是否忽略大小写比较</summary>
    public bool OriginIgnoreCase { get; set; } = true;


    // 响应头安全
    public bool EnableSecurityHeaders { get; set; } = true;
}