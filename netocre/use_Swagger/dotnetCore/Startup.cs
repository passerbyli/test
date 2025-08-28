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
            // 1) �� Security �ڵ㵽 Options
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
                // ��Ӧ��վ�� HTML ���루���ͷ����� XSS ���գ�
                o.JsonSerializerOptions.Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
                // Ҳ���Ը�Ϊ HtmlEncoder.Default ������Ҫ
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("V1", new OpenApiInfo
                {
                    // {ApiName} �����ȫ�ֱ����������޸�
                    Version = "V1",
                    Title = $"{ApiName} �ӿ��ĵ�����Netcore 3.0",
                    Description = $"{ApiName} HTTP API V1",
                    Contact = new OpenApiContact { Name = ApiName, Email = "dotnetCore@xxx.com", Url = new Uri("https://www.baidu.com") },
                    License = new OpenApiLicense { Name = ApiName, Url = new Uri("https://www.baidu.com") }
                });
                c.OrderActionsBy(o => o.RelativePath);

                
                var xmlPath = Path.Combine(AppContext.BaseDirectory, $"dotnetCore.xml");
                c.IncludeXmlComments(xmlPath, true);


                #region Token�󶨵�ConfigureServices
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "JWT��Ȩ(���ݽ�������ͷ�н��д���) ֱ�����¿�������Bearer {token}��ע������֮����һ���ո�\"",
                    Name = "Authorization",//jwtĬ�ϵĲ�������
                    In = ParameterLocation.Header,//jwtĬ�ϴ��Authorization��Ϣ��λ��(����ͷ��)
                    Type = SecuritySchemeType.ApiKey
                });
                #endregion
            });

            // HtmlEncoder ���м��ʹ�ã�����ϴʱ��
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

                //·�����ã�����Ϊ�գ���ʾֱ���ڸ�������localhost:8001�����ʸ��ļ�,ע��localhost:8001/swagger�Ƿ��ʲ����ģ�ȥlaunchSettings.json��launchUrlȥ����������뻻һ��·����ֱ��д���ּ��ɣ�����ֱ��дc.RoutePrefix = "doc";
                c.RoutePrefix = "";
            });

            app.UseHttpsRedirection();
            
            
            app.UseSecurityPipeline(); // һ�����ð�ȫ�ܵ�
            
            // ˳�򣺴�С���� > XSS ���� > ·��
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
