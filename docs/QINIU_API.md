# 七牛云上传接口文档

## 概述
前端文章编辑器需要一个后端接口来获取七牛云的临时上传凭证（UpToken）。此接口用于安全地将图片上传到七牛云对象存储。

## 安全要求

⚠️ **重要：AccessKey 和 SecretKey 必须只存储在后端服务器，绝对不能暴露给前端！**

- 前端通过此接口获取临时上传凭证
- 上传凭证应设置过期时间（建议 1-2 小时）
- 可以限制上传文件的类型、大小和存储路径

## 接口规范

### 请求

**接口地址：** `GET /api/qiniu/token`

**请求头：**
```
Authorization: Bearer {用户token}
```

**请求参数：** 无

### 响应

**成功响应：**

HTTP Status: 200

```json
{
  "msgCode": 0,
  "msgBody": {
    "token": "七牛云上传凭证字符串",
    "domain": "https://your-cdn-domain.com"
  },
  "message": "success"
}
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| msgCode | number | 状态码，0 表示成功 |
| msgBody.token | string | 七牛云上传凭证（UpToken） |
| msgBody.domain | string | CDN 访问域名，用于拼接完整的图片 URL |

**错误响应：**

```json
{
  "msgCode": 1001,
  "message": "生成上传凭证失败"
}
```

## 后端实现示例

### Java 实现（Spring Boot）

#### 1. 添加依赖

```xml
<dependency>
    <groupId>com.qiniu</groupId>
    <artifactId>qiniu-java-sdk</artifactId>
    <version>7.13.1</version>
</dependency>
```

#### 2. 配置文件

```yaml
qiniu:
  access-key: YOUR_ACCESS_KEY
  secret-key: YOUR_SECRET_KEY
  bucket: your-bucket-name
  domain: https://your-cdn-domain.com
  # 可选：限制上传文件的前缀
  prefix: article/
  # token过期时间（秒）
  expire: 7200
```

#### 3. Controller 实现

```java
@RestController
@RequestMapping("/api/qiniu")
public class QiniuController {
    
    @Autowired
    private QiniuService qiniuService;
    
    @GetMapping("/token")
    public ResponseEntity<ApiResponse> getUploadToken() {
        try {
            Map<String, String> result = qiniuService.generateUploadToken();
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(1001, "生成上传凭证失败"));
        }
    }
}
```

#### 4. Service 实现

```java
@Service
public class QiniuService {
    
    @Value("${qiniu.access-key}")
    private String accessKey;
    
    @Value("${qiniu.secret-key}")
    private String secretKey;
    
    @Value("${qiniu.bucket}")
    private String bucket;
    
    @Value("${qiniu.domain}")
    private String domain;
    
    @Value("${qiniu.expire:7200}")
    private long expire;
    
    public Map<String, String> generateUploadToken() {
        Auth auth = Auth.create(accessKey, secretKey);
        
        // 设置上传策略
        StringMap putPolicy = new StringMap();
        // 限制文件大小为 5MB
        putPolicy.put("fsizeLimit", 5 * 1024 * 1024);
        // 限制文件类型
        putPolicy.put("mimeLimit", "image/*");
        
        String token = auth.uploadToken(bucket, null, expire, putPolicy);
        
        Map<String, String> result = new HashMap<>();
        result.put("token", token);
        result.put("domain", domain);
        
        return result;
    }
}
```

### Node.js 实现（Express）

#### 1. 安装依赖

```bash
npm install qiniu
```

#### 2. 实现代码

```javascript
const express = require('express');
const qiniu = require('qiniu');

const router = express.Router();

// 配置七牛云
const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const bucket = process.env.QINIU_BUCKET;
const domain = process.env.QINIU_DOMAIN;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

router.get('/api/qiniu/token', (req, res) => {
  try {
    const options = {
      scope: bucket,
      expires: 7200, // 2小时过期
      fsizeLimit: 5 * 1024 * 1024, // 限制5MB
      mimeLimit: 'image/*' // 只允许图片
    };
    
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    
    res.json({
      msgCode: 0,
      msgBody: {
        token: uploadToken,
        domain: domain
      },
      message: 'success'
    });
  } catch (error) {
    console.error('生成七牛云token失败:', error);
    res.json({
      msgCode: 1001,
      message: '生成上传凭证失败'
    });
  }
});

module.exports = router;
```

## 七牛云配置

### 1. 创建存储空间（Bucket）

1. 登录七牛云控制台
2. 对象存储 → 空间管理 → 新建空间
3. 记录空间名称（bucket name）

### 2. 配置 CDN 域名

1. 在空间设置中绑定自定义域名（需要备案）
2. 或使用七牛提供的测试域名（有流量限制）
3. 记录 CDN 域名用于配置

### 3. CORS 配置

为了允许前端直接上传到七牛云，需要配置 CORS：

1. 进入空间设置 → 跨域设置
2. 添加 CORS 规则：
   - **允许的来源：** `http://localhost:8000,http://your-domain.com`
   - **允许的方法：** `GET, POST, PUT`
   - **允许的请求头：** `*`
   - **暴露的响应头：** `*`
   - **缓存时间：** `3600`

### 4. 安全建议

1. **使用环境变量**存储 AK/SK，不要硬编码
2. **限制上传策略**：
   - 设置文件大小限制
   - 限制文件类型（mimeLimit）
   - 限制存储路径前缀
3. **Token 过期时间**：建议 1-2 小时
4. **访问控制**：
   - 确保接口需要登录才能访问
   - 可以记录上传日志
5. **定期轮换**：定期更换 AK/SK

## 前端集成说明

前端已实现以下功能：

1. ✅ 从此接口获取上传凭证
2. ✅ 支持工具栏选择图片上传
3. ✅ 支持复制/粘贴图片自动上传
4. ✅ 支持拖拽图片上传
5. ✅ 自动替换 base64 图片为七牛云 URL
6. ✅ 文件类型和大小验证（前端 + 后端双重验证）
7. ✅ 提交前检查未上传的图片

## 测试方法

### 1. 测试接口是否正常

```bash
curl -X GET http://localhost:8082/api/qiniu/token \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. 验证返回的 token

使用返回的 token 尝试上传一张图片到七牛云：

```bash
curl -X POST http://upload.qiniup.com \
  -F "key=test/test.png" \
  -F "token=YOUR_UPLOAD_TOKEN" \
  -F "file=@test.png"
```

### 3. 前端测试

1. 启动前端项目
2. 打开文章编辑页面
3. 尝试以下操作：
   - 点击工具栏图片按钮上传
   - 复制图片后粘贴到编辑器
   - 拖拽图片到编辑器
4. 检查：
   - 图片是否成功上传
   - 图片 URL 是否可访问
   - 保存后内容中是否没有 base64

## 常见问题

### Q1: 上传失败，提示 "401 Unauthorized"

**原因：** Token 无效或已过期

**解决：**
- 检查 AK/SK 是否正确
- 检查 bucket 名称是否正确
- 确认 token 生成逻辑是否正确

### Q2: 上传成功但图片无法访问

**原因：** CDN 域名配置错误或未绑定

**解决：**
- 检查 domain 配置是否正确
- 确认域名已绑定到存储空间
- 检查存储空间是否为公开访问

### Q3: 前端报 CORS 错误

**原因：** 七牛云存储空间未配置 CORS

**解决：**
- 按照上述步骤配置 CORS
- 确保允许的来源包含前端域名

### Q4: 文件上传后找不到

**原因：** 文件 key 命名问题

**解决：**
- 前端使用 `article/` 前缀存储
- 可以在七牛云控制台的文件管理中查看

## 监控建议

建议在后端添加以下监控：

1. **上传成功率**：记录 token 生成和使用情况
2. **存储用量**：定期检查七牛云存储使用量
3. **流量消耗**：监控 CDN 流量，避免超额费用
4. **异常告警**：token 生成失败时发送告警

## 联系方式

如有问题，请联系前端开发团队。
