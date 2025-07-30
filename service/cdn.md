## 响应头信息
### Cache-Control
控制是否可缓存，缓存多长时间
若 no-store 或 private，则无法被 CDN 缓存
```
Cache-Control: public, max-age=3600
```
• public：可由 CDN 缓存；
• max-age=3600：缓存时间为 1 小时；
• 若没有该字段或是 no-store，CDN 会每次回源。


### Expires
含义：缓存过期时间（旧的缓存控制字段（已被 Cache-Control 替代））
Expires: Thu, 01 Dec 2023 16:00:00 GMT
若 Expires 未设置或已过期，则缓存失效

### X-Cache
含义：是否命中 CDN：HIT 为命中，MISS 为回源；
如果是 MISS，说明每次都回源，可能慢


### X-Via

### Age
含义：缓存命中后生存时间（秒）
Age: 0 表示刚刚回源，可视为 MISS

### Content-Encoding: gzip
含义：响应内容是否经过压缩
若无 gzip，文件会变大，加载慢

### Content-Type
含义：MIME 类型，如 text/html、application/javascript
检查是否正确，否则浏览器会延迟解析

### ETag / Last-Modified
含义：用于协商缓存
若强缓存未命中，会触发 304 检查



## html页面
新增<link rel="dns-prefetch" href="//example.com"/>