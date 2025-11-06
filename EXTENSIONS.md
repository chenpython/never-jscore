# never_jscore 扩展功能列表

## 概述

never_jscore v2.0+ 提供了丰富的 Rust 原生实现的加密和编码扩展，专为 JavaScript 逆向工程优化。

**启用方式**：创建 Context 时默认启用，或显式指定 `Context(enable_extensions=True)`

**禁用方式**：创建纯净 V8 环境 `Context(enable_extensions=False)`

---

## 已实现的功能 API

### 1. Base64 编码/解码

#### 全局函数（Web API 兼容）

| 函数 | 说明 | 示例 | 兼容性 |
|-----|------|------|--------|
| `btoa(str)` | Base64 编码 | `btoa('hello')` → `"aGVsbG8="` | ✅ 浏览器兼容 |
| `atob(str)` | Base64 解码 | `atob('aGVsbG8=')` → `"hello"` | ✅ 浏览器兼容 |

#### 底层 Ops（高级用法）

| Ops | 说明 |
|-----|------|
| `Deno.core.ops.op_base64_encode(str)` | Base64 标准编码 |
| `Deno.core.ops.op_base64_decode(str)` | Base64 标准解码 |
| `Deno.core.ops.op_base64url_encode(str)` | Base64 URL 安全编码 |
| `Deno.core.ops.op_base64url_decode(str)` | Base64 URL 安全解码 |

---

### 2. 哈希函数

#### 全局函数

| 函数 | 说明 | 输出 | 示例 |
|-----|------|------|------|
| `md5(str)` | MD5 哈希 | hex (32字符) | `md5('hello')` → `"5d41402abc..."` |
| `sha1(str)` | SHA1 哈希 | hex (40字符) | `sha1('hello')` → `"aaf4c61ddc..."` |
| `sha256(str)` | SHA256 哈希 | hex (64字符) | `sha256('hello')` → `"2cf24dba5f..."` |
| `sha512(str)` | SHA512 哈希 | hex (128字符) | `sha512('hello')` → `"9b71d224bd..."` |

#### 底层 Ops

| Ops | 说明 |
|-----|------|
| `Deno.core.ops.op_md5(str)` | MD5 哈希 |
| `Deno.core.ops.op_sha1(str)` | SHA1 哈希 |
| `Deno.core.ops.op_sha256(str)` | SHA256 哈希 |
| `Deno.core.ops.op_sha512(str)` | SHA512 哈希 |

---

### 3. HMAC（消息认证码）

#### CryptoUtils 方法

| 函数 | 说明 | 输出 | 示例 |
|-----|------|------|------|
| `CryptoUtils.hmacMd5(key, msg)` | HMAC-MD5 | hex (32字符) | `CryptoUtils.hmacMd5('secret', 'data')` |
| `CryptoUtils.hmacSha1(key, msg)` | HMAC-SHA1 | hex (40字符) | `CryptoUtils.hmacSha1('secret', 'data')` |
| `CryptoUtils.hmacSha256(key, msg)` | HMAC-SHA256 | hex (64字符) | `CryptoUtils.hmacSha256('secret', 'data')` |

#### 底层 Ops

| Ops | 说明 |
|-----|------|
| `Deno.core.ops.op_hmac_md5(key, msg)` | HMAC-MD5 |
| `Deno.core.ops.op_hmac_sha1(key, msg)` | HMAC-SHA1 |
| `Deno.core.ops.op_hmac_sha256(key, msg)` | HMAC-SHA256 |

---

### 4. Hex 编码/解码

#### CryptoUtils 方法

| 函数 | 说明 | 示例 |
|-----|------|------|
| `CryptoUtils.hexEncode(str)` | Hex 编码 | `CryptoUtils.hexEncode('hello')` → `"48656c6c6f"` |
| `CryptoUtils.hexDecode(str)` | Hex 解码 | `CryptoUtils.hexDecode('48656c6c6f')` → `"hello"` |

#### 底层 Ops

| Ops | 说明 |
|-----|------|
| `Deno.core.ops.op_hex_encode(str)` | Hex 编码 |
| `Deno.core.ops.op_hex_decode(str)` | Hex 解码 |

---

### 5. URL 编码（Web API 兼容）

#### 全局函数（Web API 兼容）

| 函数 | 说明 | 示例 | 兼容性 |
|-----|------|------|--------|
| `encodeURIComponent(str)` | URI 组件编码 | `encodeURIComponent('hello world')` → `"hello%20world"` | ✅ 浏览器兼容 |
| `decodeURIComponent(str)` | URI 组件解码 | `decodeURIComponent('hello%20world')` → `"hello world"` | ✅ 浏览器兼容 |
| `encodeURI(str)` | URI 编码（保留结构） | `encodeURI('https://example.com/path?query=hello world')` | ✅ 浏览器兼容 |
| `decodeURI(str)` | URI 解码 | `decodeURI('...')` | ✅ 浏览器兼容 |

#### CryptoUtils 方法

| 函数 | 说明 |
|-----|------|
| `CryptoUtils.urlEncode(str)` | URL 完整编码（所有特殊字符） |
| `CryptoUtils.urlDecode(str)` | URL 解码 |

#### 底层 Ops

| Ops | 说明 |
|-----|------|
| `Deno.core.ops.op_url_encode(str)` | URL 完整编码 |
| `Deno.core.ops.op_url_decode(str)` | URL 解码 |
| `Deno.core.ops.op_encode_uri_component(str)` | URI 组件编码 |
| `Deno.core.ops.op_decode_uri_component(str)` | URI 组件解码 |
| `Deno.core.ops.op_encode_uri(str)` | URI 编码 |

---

### 6. CryptoUtils 工具对象

#### 链式调用 API（类 Node.js crypto）

```javascript
// 创建哈希对象（链式调用）
const hash = CryptoUtils.createHash('sha256');
hash.update('part1');
hash.update('part2');
const result = hash.digest('hex');  // 或 'base64'

// 创建 HMAC 对象（链式调用）
const hmac = CryptoUtils.createHmac('sha256', 'secret-key');
hmac.update('data');
const mac = hmac.digest('hex');
```

#### 支持的算法

| createHash() | createHmac() |
|-------------|--------------|
| 'md5' | 'md5' |
| 'sha1' | 'sha1' |
| 'sha256' | 'sha256' |
| 'sha512' | ❌ |

#### 支持的编码格式

| digest() 参数 | 说明 |
|--------------|------|
| 'hex' (默认) | 十六进制字符串 |
| 'base64' | Base64 编码 |

---

## 使用示例

### Python 端

```python
import never_jscore

# 创建带扩展的 Context（默认）
ctx = never_jscore.Context()

# 直接使用全局函数
result = ctx.evaluate("btoa('hello')")
print(result)  # aGVsbG8=

result = ctx.evaluate("md5('password')")
print(result)  # 5f4dcc3b5aa765d61d8327deb882cf99

# 使用 CryptoUtils
result = ctx.evaluate("CryptoUtils.hmacSha256('key', 'message')")
print(result)  # 6e9ef29b75fffc5b7abae527d58fdadb2fe42e7219011976917343065f58ed4a

# 创建纯净 V8 环境
ctx_pure = never_jscore.Context(enable_extensions=False)
# btoa 等函数不可用
```

### JavaScript 端

```javascript
// Base64
const encoded = btoa('hello');
const decoded = atob(encoded);

// 哈希
const hash = md5('password');
const signature = sha256('data');

// HMAC
const mac = CryptoUtils.hmacSha256('secret-key', 'message');

// URL 编码
const encoded = encodeURIComponent('hello world?test=1');
const decoded = decodeURIComponent(encoded);

// 链式 API
const hash = CryptoUtils.createHash('sha256')
    .update('part1')
    .update('part2')
    .digest('hex');

// 真实场景：API 签名生成
function generateApiSignature(apiKey, timestamp, data) {
    const message = apiKey + timestamp + JSON.stringify(data);
    const hash = sha256(message);
    return btoa(hash);
}
```

---

## 性能特点

- ✅ **纯 Rust 实现**：所有算法使用 RustCrypto 库，性能极佳
- ✅ **零拷贝**：直接在 V8 和 Rust 之间传输数据，无中间层
- ✅ **自动注入**：Context 初始化时自动加载，无需手动引入
- ✅ **兼容性好**：API 设计兼容浏览器和 Node.js，易于迁移

---

## 依赖的 Rust Crates

| Crate | 版本 | 用途 |
|-------|------|------|
| `base64` | 0.22 | Base64 编码/解码 |
| `md-5` | 0.10 | MD5 哈希 |
| `sha1` | 0.10 | SHA1 哈希 |
| `sha2` | 0.10 | SHA256/SHA512 哈希 |
| `hmac` | 0.12 | HMAC 实现 |
| `hex` | 0.4 | Hex 编码/解码 |
| `urlencoding` | 2.1 | URL 编码 |
| `percent-encoding` | 2.3 | URI 百分号编码 |

---

## 扩展检测

在 JavaScript 中检测是否加载了扩展：

```javascript
if (typeof __NEVER_JSCORE_EXTENSIONS_LOADED__ !== 'undefined') {
    console.log('Extensions are loaded');
    console.log('btoa is available:', typeof btoa !== 'undefined');
    console.log('md5 is available:', typeof md5 !== 'undefined');
}
```

---

## 总结

**共实现 18 个底层 Ops**：
- Base64: 4 个
- 哈希: 4 个
- HMAC: 3 个
- Hex: 2 个
- URL: 5 个

**全局函数/对象**：
- `btoa`, `atob`
- `md5`, `sha1`, `sha256`, `sha512`
- `encodeURIComponent`, `decodeURIComponent`, `encodeURI`, `decodeURI`
- `CryptoUtils` (工具对象)

**适用场景**：
- ✅ JavaScript 逆向工程
- ✅ API 签名验证
- ✅ 数据加密/解密
- ✅ 爬虫反爬破解
