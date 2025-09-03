看到了：你在 .NET Core 3.0 WebAPI 里给模型字段加了 [StringLength] 这类注解，但“没有生效”。这通常不是注解本身的问题，而是验证没有被触发或被你关掉了。按优先级给你一套排查 + 直接可用的修复代码。

先自检 7 点（命中一个就能解释“为何不生效”）
1.	有没有 [ApiController]
没有的话，不会自动 400，你必须手动检查 ModelState.IsValid。

[ApiController] // 没有它就加上
[Route("api/[controller]")]
public class UsersController : ControllerBase { ... }


	2.	是否用了 AddMvcCore() 却没加 DataAnnotations
用 AddMvcCore() 时，必须显式 .AddDataAnnotations()；用 AddControllers() 则自带。

// 任选其一
services.AddControllers(); // 推荐
// 或：
services.AddMvcCore().AddApiExplorer().AddDataAnnotations(); // 用了 AddMvcCore 时务必加


	3.	是否关闭了自动模型验证
你之前想自定义返回 200 的错误体时，可能写过：

services.Configure<ApiBehaviorOptions>(o => o.SuppressModelStateInvalidFilter = true);

关了它就不会自动拦截，此时要么手动 if (!ModelState.IsValid)，要么加全局过滤器（见下）。

	4.	参数类型是否走了模型绑定
如果你的 Action 参数是 string/JObject，你再手动反序列化为 DTO，验证不会自动触发。要让验证生效，Action 参数直接用 DTO：

public IActionResult Create([FromBody] CreateUserDto dto) { ... }


	5.	属性类型与注解是否匹配
	•	[StringLength] 只对 string 有效；数组/集合用 [MaxLength]/[MinLength]。
	•	必填请加 [Required]（3.0 没有“非空引用类型自动必填”）。
	6.	Content-Type 是否正确
入参必须是 application/json（或你支持的 JSON 媒体类型），否则可能绑定失败导致验证没跑。
7.	是否有你自己的验证/异常中间件把结果“吃掉了”
有些中间件会统一包装响应，但没在验证前短路，从而表现为“没生效”。

⸻

想“继续返回 200 + 自定义错误体”？加一个全局过滤器

（你之前提过要统一返回 {status:500, error:"参数错误"}，下面就是一键接入的方案）

1) 开启注解 & 关闭默认 400

services.AddControllers(); // 或 AddMvcCore().AddDataAnnotations()
services.Configure<ApiBehaviorOptions>(o =>
{
o.SuppressModelStateInvalidFilter = true; // 关闭自动 400
});

2) 全局过滤器：拦截无效模型并返回你的格式

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

public class ValidateModelFilter : IActionFilter
{
public void OnActionExecuting(ActionExecutingContext context)
{
if (!context.ModelState.IsValid)
{
var errors = context.ModelState
.Where(kv => kv.Value.Errors.Count > 0)
.ToDictionary(
kv => kv.Key,
kv => kv.Value.Errors.Select(e => string.IsNullOrEmpty(e.ErrorMessage) ? e.Exception?.Message : e.ErrorMessage).ToArray()
);

            context.Result = new JsonResult(new
            {
                status = 500,
                error = "参数错误",
                errors
            });
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}

注册（全局生效）：

services.AddControllers(options =>
{
options.Filters.Add<ValidateModelFilter>();
});

这样：注解仍然正常验证，只是不再返回 400，而是用你要的 200 + 自定义体。

⸻

想走“标准做法”（验证失败直接 400）？

最少只要两步：

services.AddControllers(); // 或 AddMvcCore().AddDataAnnotations()
services.Configure<ApiBehaviorOptions>(o => o.SuppressModelStateInvalidFilter = false); // 默认就是 false，可省略

确保控制器有 [ApiController]，然后不需要在 Action 里写 ModelState.IsValid，框架会自动 400 并返回错误详情。

⸻

参考：一个可运行的最小示例

public class CreateUserDto
{
[Required]
[StringLength(16, MinimumLength = 2, ErrorMessage = "用户名长度 2~16")]
public string UserName { get; set; }

    [MaxLength(100)]
    public string NickName { get; set; }

    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; }

    [MaxLength(5, ErrorMessage = "最多 5 个标签")]
    public string[] Tags { get; set; }
}

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
[HttpPost("create")]
public IActionResult Create([FromBody] CreateUserDto dto)
{
// 如果你启用了 ValidateModelFilter，这里不需要手动判断
return Ok(new { ok = true });
}
}


⸻

常见“踩坑复盘”
•	用了 AddMvcCore() 却忘了 .AddDataAnnotations() → 注解不生效。
•	关了自动 400，但没手动/全局拦截 → “看起来没生效”。
•	Action 参数不是 DTO，而是原始 string/JObject → 验证不会触发。
•	想限制数组长度却用了 [StringLength] → 对集合没效果，应改 [MaxLength]/[MinLength]。

如果你把 Startup.ConfigureServices 的相关片段贴出来（以及某个 DTO + 控制器方法），我可以直接帮你把“标准 400 模式”或“200 包装模式”接通，保证注解立即生效。