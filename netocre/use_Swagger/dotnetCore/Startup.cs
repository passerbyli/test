using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Text.Encodings.Web;
using dotnetCore.Middleware;
using dotnetCore.Model;
using Microsoft.AspNetCore.Server.Kestrel.Core;

namespace dotnetCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public string ApiName { get; set; } = "dotnetCore";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 1) 绑定 Security 节点到 Options
            services.Configure<SecurityOptions>(Configuration.GetSection("Security"));

            services.Configure<IISServerOptions>(options =>
            {
                options.MaxRequestBodySize = 10 * 1024; // 10KB
            });

            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = 10 * 1024; // 10KB
            });



            services.AddControllers()
                .AddJsonOptions(o =>
            {
                // 响应出站的 HTML 编码（降低反射型 XSS 风险）
                o.JsonSerializerOptions.Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
                // 也可以改为 HtmlEncoder.Default 根据需要
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("V1", new OpenApiInfo
                {
                    // {ApiName} 定义成全局变量，方便修改
                    Version = "V1",
                    Title = $"{ApiName} 接口文档——Netcore 3.0",
                    Description = $"{ApiName} HTTP API V1",
                    Contact = new OpenApiContact { Name = ApiName, Email = "dotnetCore@xxx.com", Url = new Uri("https://www.baidu.com") },
                    License = new OpenApiLicense { Name = ApiName, Url = new Uri("https://www.baidu.com") }
                });
                c.OrderActionsBy(o => o.RelativePath);

                
                var xmlPath = Path.Combine(AppContext.BaseDirectory, $"dotnetCore.xml");
                c.IncludeXmlComments(xmlPath, true);


                #region Token绑定到ConfigureServices
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "JWT授权(数据将在请求头中进行传输) 直接在下框中输入Bearer {token}（注意两者之间是一个空格）\"",
                    Name = "Authorization",//jwt默认的参数名称
                    In = ParameterLocation.Header,//jwt默认存放Authorization信息的位置(请求头中)
                    Type = SecuritySchemeType.ApiKey
                });
                #endregion
            });

            // HtmlEncoder 供中间件使用（简单清洗时）
            services.AddSingleton(HtmlEncoder.Default);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint($"/swagger/V1/swagger.json", $"{ApiName} V1");

                //路径配置，设置为空，表示直接在根域名（localhost:8001）访问该文件,注意localhost:8001/swagger是访问不到的，去launchSettings.json把launchUrl去掉，如果你想换一个路径，直接写名字即可，比如直接写c.RoutePrefix = "doc";
                c.RoutePrefix = "";
            });

            app.UseHttpsRedirection();
            
            
            app.UseSecurityPipeline(); // 一行启用安全管道
            
            // 顺序：大小限制 > XSS 过滤 > 路由
            // app.UseMiddleware<RequestSizeLimitMiddleware>();
            // app.UseMiddleware<XssRequestFilterMiddleware>();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
