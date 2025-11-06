# never_jscore v2.0.0 功能总结

## 核心功能

### 1. 高性能 JavaScript 执行
- 基于 Rust + Deno Core (V8 引擎)
- 比 PyExecJS 快 100-300倍
- 与 PyMiniRacer 性能相当，部分场景更快

### 2. 完整 Promise/async 支持
- 自动等待 Promise 结果
- 支持 async/await
- 支持 Promise.all、Promise.race 等
- 唯一高性能 Promise 方案

### 3. py_mini_racer 兼容 API
- 实例化设计：`ctx = never_jscore.Context()`
- `compile()`: 编译代码到全局作用域
- `evaluate()`: 求值并返回结果
- `call()`: 调用函数
- `eval()`: 执行代码（可选返回值）

## Web API 扩展（v2.0 新增）

### Crypto APIs

#### Base64 编解码
```python
ctx.evaluate("btoa('hello')")  # "aGVsbG8="
ctx.evaluate("atob('aGVsbG8=')")  # "hello"
```

#### 哈希函数
```python
ctx.evaluate("md5('test')")     # MD5 hash
ctx.evaluate("sha1('test')")    # SHA1 hash
ctx.evaluate("sha256('test')")  # SHA256 hash
ctx.evaluate("sha512('test')")  # SHA512 hash
```

#### HMAC
```python
ctx.evaluate("CryptoUtils.hmacMd5('key', 'message')")
ctx.evaluate("CryptoUtils.hmacSha1('key', 'message')")
ctx.evaluate("CryptoUtils.hmacSha256('key', 'message')")
```

#### Hex 编解码
```python
ctx.evaluate("CryptoUtils.hexEncode('test')")  # "74657374"
ctx.evaluate("CryptoUtils.hexDecode('74657374')")  # "test"
```

#### 链式 API（类 Node.js）
```python
ctx.evaluate("""
    CryptoUtils.createHash('sha256')
        .update('hello')
        .update(' world')
        .digest('hex')
""")

ctx.evaluate("""
    CryptoUtils.createHmac('sha256', 'secret')
        .update('data')
        .digest('base64')
""")
```

### URL 编码

```python
ctx.evaluate("encodeURIComponent('hello world')")  # "hello%20world"
ctx.evaluate("decodeURIComponent('hello%20world')")  # "hello world"
ctx.evaluate("encodeURI('http://example.com/path?q=hello world')")
ctx.evaluate("decodeURI('http://example.com/path?q=hello%20world')")
```

### 随机数生成

```python
# UUID v4
ctx.evaluate("crypto.randomUUID()")
# "a3111236-1431-4d0d-807e-6c7b388d4433"

# 随机字节数组
ctx.evaluate("""
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    Array.from(arr)
""")
# [123, 45, 67, ...]

# 随机浮点数（通过 Deno ops）
ctx.evaluate("Deno.core.ops.op_crypto_random()")  # 0.123456789
```

### 定时器（立即执行版本）

```python
ctx.evaluate("typeof setTimeout")  # "function"
ctx.evaluate("typeof setInterval")  # "function"
ctx.evaluate("typeof clearTimeout")  # "function"
ctx.evaluate("typeof clearInterval")  # "function"
```

⚠️ **注意**：setTimeout/setInterval 是立即执行的假异步，仅用于通过 API 检测。

### Worker API（单线程模拟）

```python
ctx.evaluate("typeof Worker")  # "function"
ctx.evaluate("""
    const worker = new Worker('test.js');
    typeof worker.postMessage === 'function'
""")  # True
```

⚠️ **注意**：Worker 是单线程模拟，不会真正创建多线程，仅用于通过代码检测。

## 使用方式

### 启用扩展（默认，推荐）

```python
import never_jscore

ctx = never_jscore.Context()  # 默认 enable_extensions=True
ctx = never_jscore.Context(enable_extensions=True)

# 可以直接使用所有扩展
result = ctx.evaluate("btoa('hello')")  # 无需 polyfill
```

### 禁用扩展（纯净 V8）

```python
ctx = never_jscore.Context(enable_extensions=False)

# 只有 ECMAScript 标准 API
ctx.evaluate("typeof btoa")  # "undefined"
ctx.evaluate("JSON.stringify({a: 1})")  # 标准 API 可用
```

## 技术实现

### 架构
- **Rust 层**：使用 `#[op2]` 宏定义底层操作
  - `crypto_ops.rs`: 加密操作（Base64、Hash、HMAC、Random）
  - `encoding_ops.rs`: URL 编码
  - `timer_ops.rs`: 定时器 ops
  - `worker_ops.rs`: Worker ops
- **JavaScript 层**：`src/dddd_js/js_polyfill.js` 封装为标准 Web API
- **自动注入**：`enable_extensions=True` 时自动加载

### 性能
- Rust 实现，性能接近原生
- JavaScript polyfill 层仅在必要时使用
- 无运行时开销（扩展在 Context 创建时注入）

## 适用场景

### JS 逆向工程（首选）
- 直接运行网站加密 JS（无需 polyfill）
- 支持常见的加密算法（MD5、SHA256、HMAC）
- 支持 Base64 编解码
- 支持 URL 编码
- 兼容检测 setTimeout、Worker 等 API

### API 签名生成
- 内置 HMAC、Hash、Base64
- 支持 URL 编码
- 性能极高，适合批量处理

### 异步数据处理
- Promise/async 完整支持
- 批量并发处理

## 限制

### 多 Context 限制
1. **不能交叉使用**：创建第二个 Context 后，不能再用第一个
2. **LIFO 删除顺序**：必须按后进先出顺序删除（后创建先删除）

推荐模式：**单 Context 模式**（最佳性能）

### 假扩展说明
- **setTimeout/setInterval**：立即执行，不是真正的异步定时器
- **Worker**：单线程模拟，不会真正创建多线程

这些假扩展足以应对 90%+ 的 JS 逆向场景（只需通过 API 检测）。

## 依赖

```toml
deno_core = "0.365.0"     # V8 引擎
pyo3 = "0.27.1"           # Python 绑定
tokio = "1.48"            # 异步运行时
rand = "0.8"              # 随机数
base64 = "0.22"           # Base64
md-5 = "0.10"             # MD5
sha1 = "0.10"             # SHA1
sha2 = "0.10"             # SHA256/512
hmac = "0.12"             # HMAC
hex = "0.4"               # Hex 编解码
urlencoding = "2.1"       # URL 编码
percent-encoding = "2.3"  # Percent 编码
```

## 测试

```bash
# 基础功能测试
python test_async_simple.py

# Web API 扩展测试
python test_extensions.py
python test_new_apis.py
```

## 总结

never_jscore v2.0.0 是一个**为 JS 逆向工程优化的高性能 Python JavaScript 引擎**：

✅ 性能极高（比 PyExecJS 快 100-300倍）
✅ Promise/async 完整支持
✅ 内置常用 Web API（无需 polyfill）
✅ 专为 JS 逆向设计
✅ 简单易用（py_mini_racer 兼容 API）
✅ 类型安全（完整类型提示）

非常适合：
- JS 加密算法逆向
- API 签名生成
- 批量 JS 数据处理
- 自动化爬虫（需要执行 JS）
