

1) 依赖（仅编译期扫描需要）

<!-- 供扫描 JAX-RS 注解使用（javax 版本，适配 CXF 3.5.x） -->
<dependency>
  <groupId>io.swagger.core.v3</groupId>
  <artifactId>swagger-jaxrs2</artifactId>
  <version>2.2.22</version>
  <scope>provided</scope>
</dependency>

<!--（可选）Bean Validation 约束进文档；Boot 2.7 默认已有 javax.validation -->
<dependency>
  <groupId>javax.validation</groupId>
  <artifactId>validation-api</artifactId>
  <version>2.0.1.Final</version>
  <scope>provided</scope>
</dependency>

说明：不需要引入任何 Swagger 注解（@Operation 等），插件会从 JAX-RS 注解 推断路径、方法、参数；有 @NotNull/@Size 也会体现在 schema 里。

2) Maven 插件（构建期生成 OpenAPI JSON）

<build>
  <plugins>
    <!-- 保留方法参数名，避免文档里出现 arg0/arg1 -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <configuration>
        <parameters>true</parameters>
      </configuration>
    </plugin>

    <!-- 生成 OpenAPI 文档（无需启动应用） -->
    <plugin>
      <groupId>io.swagger.core.v3</groupId>
      <artifactId>swagger-maven-plugin</artifactId>
      <version>2.2.22</version>
      <executions>
        <execution>
          <phase>compile</phase>
          <goals>
            <goal>resolve</goal>
          </goals>
          <configuration>
            <!-- 指定存放 openapi.json 的目录与文件名 -->
            <outputPath>${project.build.directory}</outputPath>
            <outputFileName>swagger</outputFileName> <!-- 生成 swagger.json -->
            <outputFormat>JSON</outputFormat>
            <prettyPrint>true</prettyPrint>

            <!-- 必填：把你的 JAX-RS 资源类所在包列出来（可多个） -->
            <resourcePackages>
              <package>com.yourcompany.yourapp.api</package>
              <!-- <package>com.yourcompany.yourapp.other</package> -->
            </resourcePackages>

            <!-- 如有需要可精确到类：
            <resourceClasses>
              <class>com.yourcompany.yourapp.api.UserResource</class>
            </resourceClasses>
            -->

            <!-- 关闭依赖扫描，专注本模块代码 -->
            <scanDependencies>false</scanDependencies>

            <!-- 文档基本信息（可选） -->
            <openapi>
              <info>
                <title>My CXF APIs</title>
                <version>v1</version>
              </info>
            </openapi>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>

执行：

mvn -q clean compile

生成文件：target/swagger.json（即你要的文件名），可直接交付给网关/门户/前端工具使用。

⸻

使用要点 / 常见坑
	•	包路径一定要对：<resourcePackages> 指到真正放 @Path 资源类的包，否则扫描不到。
	•	参数名变 arg0? 给编译器开启 -parameters（上面的 maven-compiler-plugin 已给出）。
	•	仅 JAX-RS 注解也可生成：没有 Swagger 注解时，描述会简陋（无摘要/示例/响应码文案），但路径与参数类型都是完整的。
	•	javax / jakarta 区分：你用的是 CXF 3.5.11（javax.ws.rs），所以依赖用 swagger-jaxrs2；如果将来升级到 CXF 4（jakarta.ws.rs），改成 swagger-jaxrs2-jakarta 即可。
	•	复杂模型：尽量给 DTO 写上 JSR-303 约束（@NotNull/@Size/@Min/@Max）与 Jackson 注解（@JsonProperty），这样即使没有 Swagger 注解，schema 也更完整。
	•	不启动项目：这个插件是静态扫描字节码/源码，不会启动 Spring 容器或嵌入式服务器，满足你的要求。

⸻

如果你贴一下 JAX-RS 资源类的包名，我可以把 <resourcePackages> 精确到你项目结构；或者如果需要 YAML 同时产出，也可以顺手给你加上双格式输出。