1.	安装 CLI：
dotnet tool install --global swashbuckle.aspnetcore.cli

	2.	确保你的 Web 项目里已引用 Swashbuckle.AspNetCore 并配置了 AddSwaggerGen()。
	3.	编译项目，拿到 MyApi.dll（例如 bin/Debug/net8.0/MyApi.dll）。
	4.	生成 swagger：
    ```
    # v1 是你在 SwaggerGen 里定义的文档名
dotnet swagger tofile \
  --output ./swagger.json \
  ./bin/Debug/net8.0/MyApi.dll v1
    ```

    这一步会在不真正托管 HTTP 的情况下执行启动流程来生成文档（仍可能需要能加载到配置/依赖）。

	5.	再用上面的 parse-swagger.js 生成接口清单。
```
const fs = require('fs');

const file = process.argv[2] || './swagger.json';
const doc = JSON.parse(fs.readFileSync(file, 'utf-8'));
const paths = doc.paths || {};

function resolveSchema(schema) {
  if (!schema) return 'void';
  if (schema.$ref) return schema.$ref.split('/').slice(-1)[0];
  if (schema.type === 'array') return `Array<${resolveSchema(schema.items)}>`;
  if (schema.type) return schema.type;
  return 'object';
}

const rows = [];
for (const [route, methods] of Object.entries(paths)) {
  for (const [method, op] of Object.entries(methods)) {
    const summary = op.summary || '';
    const params = (op.parameters || []).map(p => ({
      name: p.name,
      in: p.in,
      required: !!p.required,
      type: resolveSchema(p.schema)
    }));
    // requestBody
    if (op.requestBody?.content) {
      for (const [ct, media] of Object.entries(op.requestBody.content)) {
        rows.push({
          method: method.toUpperCase(),
          route,
          summary,
          param_in: 'body',
          param_name: '(body)',
          required: !!op.requestBody.required,
          type: resolveSchema(media.schema),
          contentType: ct,
          response: resolveSchema(op.responses?.['200']?.content?.['application/json']?.schema
            || op.responses?.['200']?.content?.[Object.keys(op.responses?.['200']?.content || {})[0]]?.schema)
        });
      }
    }
    // parameters
    params.forEach(p => rows.push({
      method: method.toUpperCase(),
      route,
      summary,
      param_in: p.in,
      param_name: p.name,
      required: p.required,
      type: p.type,
      contentType: ''
    }));
    // 无参数也给一行，带上响应类型
    if (params.length === 0 && !op.requestBody) {
      rows.push({
        method: method.toUpperCase(),
        route,
        summary,
        param_in: '-',
        param_name: '-',
        required: false,
        type: '-',
        contentType: '',
        response: resolveSchema(
          op.responses?.['200']?.content?.['application/json']?.schema
          || op.responses?.['200']?.content?.[Object.keys(op.responses?.['200']?.content || {})[0]]?.schema
        )
      });
    }
  }
}

const out = './api-list.json';
fs.writeFileSync(out, JSON.stringify(rows, null, 2));
console.log(`OK -> ${out}, count=${rows.length}`);
```

# 假设已把 /swagger/v1/swagger.json 下载到当前目录
node parse-swagger.js ./swagger.json
# 产出 api-list.json：每条记录含 method/route/param_in/param_name/type/response 等