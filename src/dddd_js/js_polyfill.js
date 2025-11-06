// js_polyfill.js - JavaScript 封装层，提供 Web API 兼容的接口
// 自动注入到 never_jscore 运行时环境

// ============================================
// Base64 操作 (兼容 Web API)
// ============================================

/**
 * Base64 编码（兼容浏览器 btoa）
 * @param {string} str - 要编码的字符串
 * @returns {string} Base64 编码结果
 */
function btoa(str) {
    return Deno.core.ops.op_base64_encode(String(str));
}

/**
 * Base64 解码（兼容浏览器 atob）
 * @param {string} str - Base64 编码的字符串
 * @returns {string} 解码结果
 */
function atob(str) {
    return Deno.core.ops.op_base64_decode(String(str));
}

// ============================================
// 哈希函数
// ============================================

/**
 * MD5 哈希
 * @param {string} str - 输入字符串
 * @returns {string} MD5 哈希值（hex）
 */
function md5(str) {
    return Deno.core.ops.op_md5(String(str));
}

/**
 * SHA1 哈希
 * @param {string} str - 输入字符串
 * @returns {string} SHA1 哈希值（hex）
 */
function sha1(str) {
    return Deno.core.ops.op_sha1(String(str));
}

/**
 * SHA256 哈希
 * @param {string} str - 输入字符串
 * @returns {string} SHA256 哈希值（hex）
 */
function sha256(str) {
    return Deno.core.ops.op_sha256(String(str));
}

/**
 * SHA512 哈希
 * @param {string} str - 输入字符串
 * @returns {string} SHA512 哈希值（hex）
 */
function sha512(str) {
    return Deno.core.ops.op_sha512(String(str));
}

// ============================================
// HMAC 操作
// ============================================

/**
 * HMAC-MD5
 * @param {string} key - 密钥
 * @param {string} message - 消息
 * @returns {string} HMAC 值（hex）
 */
function hmacMd5(key, message) {
    return Deno.core.ops.op_hmac_md5(String(key), String(message));
}

/**
 * HMAC-SHA1
 * @param {string} key - 密钥
 * @param {string} message - 消息
 * @returns {string} HMAC 值（hex）
 */
function hmacSha1(key, message) {
    return Deno.core.ops.op_hmac_sha1(String(key), String(message));
}

/**
 * HMAC-SHA256
 * @param {string} key - 密钥
 * @param {string} message - 消息
 * @returns {string} HMAC 值（hex）
 */
function hmacSha256(key, message) {
    return Deno.core.ops.op_hmac_sha256(String(key), String(message));
}

// ============================================
// Hex 操作
// ============================================

/**
 * Hex 编码
 * @param {string} str - 输入字符串
 * @returns {string} Hex 编码结果
 */
function hexEncode(str) {
    return Deno.core.ops.op_hex_encode(String(str));
}

/**
 * Hex 解码
 * @param {string} str - Hex 编码的字符串
 * @returns {string} 解码结果
 */
function hexDecode(str) {
    return Deno.core.ops.op_hex_decode(String(str));
}

// ============================================
// URL 编码（覆盖原生实现或提供缺失的实现）
// ============================================

/**
 * URL 编码（编码所有特殊字符）
 * @param {string} str - 输入字符串
 * @returns {string} URL 编码结果
 */
function urlEncode(str) {
    return Deno.core.ops.op_url_encode(String(str));
}

/**
 * URL 解码
 * @param {string} str - URL 编码的字符串
 * @returns {string} 解码结果
 */
function urlDecode(str) {
    return Deno.core.ops.op_url_decode(String(str));
}

/**
 * encodeURIComponent（兼容 Web API）
 * 编码 URI 组件，编码所有特殊字符
 * @param {string} str - 输入字符串
 * @returns {string} 编码结果
 */
if (typeof encodeURIComponent === 'undefined') {
    globalThis.encodeURIComponent = function(str) {
        return Deno.core.ops.op_encode_uri_component(String(str));
    };
}

/**
 * decodeURIComponent（兼容 Web API）
 * 解码 URI 组件
 * @param {string} str - 编码的字符串
 * @returns {string} 解码结果
 */
if (typeof decodeURIComponent === 'undefined') {
    globalThis.decodeURIComponent = function(str) {
        return Deno.core.ops.op_decode_uri_component(String(str));
    };
}

/**
 * encodeURI（兼容 Web API）
 * 编码 URI，保留 URI 结构字符
 * @param {string} str - 输入字符串
 * @returns {string} 编码结果
 */
if (typeof encodeURI === 'undefined') {
    globalThis.encodeURI = function(str) {
        return Deno.core.ops.op_encode_uri(String(str));
    };
}

/**
 * decodeURI（兼容 Web API）
 * 解码 URI
 * @param {string} str - 编码的字符串
 * @returns {string} 解码结果
 */
if (typeof decodeURI === 'undefined') {
    globalThis.decodeURI = function(str) {
        return Deno.core.ops.op_decode_uri_component(String(str));
    };
}

// ============================================
// Crypto 命名空间（类 Node.js crypto 风格）
// ============================================

/**
 * Crypto 工具对象
 */
var CryptoUtils = {
    // 哈希函数
    md5: md5,
    sha1: sha1,
    sha256: sha256,
    sha512: sha512,

    // HMAC
    hmacMd5: hmacMd5,
    hmacSha1: hmacSha1,
    hmacSha256: hmacSha256,

    // Base64
    base64Encode: btoa,
    base64Decode: atob,

    // Hex
    hexEncode: hexEncode,
    hexDecode: hexDecode,

    // URL
    urlEncode: urlEncode,
    urlDecode: urlDecode,

    /**
     * 创建哈希对象（链式调用风格）
     * @param {string} algorithm - 算法名称: 'md5', 'sha1', 'sha256', 'sha512'
     * @returns {Object} 哈希对象
     */
    createHash: function(algorithm) {
        var data = '';
        return {
            update: function(input) {
                data += String(input);
                return this;
            },
            digest: function(encoding) {
                var result;
                switch (algorithm.toLowerCase()) {
                    case 'md5':
                        result = md5(data);
                        break;
                    case 'sha1':
                        result = sha1(data);
                        break;
                    case 'sha256':
                        result = sha256(data);
                        break;
                    case 'sha512':
                        result = sha512(data);
                        break;
                    default:
                        throw new Error('Unsupported hash algorithm: ' + algorithm);
                }

                if (encoding === 'base64') {
                    return btoa(result);
                }
                return result; // 默认返回 hex
            }
        };
    },

    /**
     * 创建 HMAC 对象（链式调用风格）
     * @param {string} algorithm - 算法名称: 'md5', 'sha1', 'sha256'
     * @param {string} key - 密钥
     * @returns {Object} HMAC 对象
     */
    createHmac: function(algorithm, key) {
        var data = '';
        var hmacKey = String(key);
        return {
            update: function(input) {
                data += String(input);
                return this;
            },
            digest: function(encoding) {
                var result;
                switch (algorithm.toLowerCase()) {
                    case 'md5':
                        result = hmacMd5(hmacKey, data);
                        break;
                    case 'sha1':
                        result = hmacSha1(hmacKey, data);
                        break;
                    case 'sha256':
                        result = hmacSha256(hmacKey, data);
                        break;
                    default:
                        throw new Error('Unsupported HMAC algorithm: ' + algorithm);
                }

                if (encoding === 'base64') {
                    return btoa(result);
                }
                return result; // 默认返回 hex
            }
        };
    }
};

// ============================================
// 导出到全局作用域
// ============================================

// 将常用函数导出到全局
globalThis.btoa = btoa;
globalThis.atob = atob;
globalThis.CryptoUtils = CryptoUtils;

// 便捷的全局哈希函数
globalThis.md5 = md5;
globalThis.sha1 = sha1;
globalThis.sha256 = sha256;
globalThis.sha512 = sha512;

// ============================================
// 控制台提示（可选）
// ============================================

// 标记环境已加载扩展
globalThis.__NEVER_JSCORE_EXTENSIONS_LOADED__ = true;

// ============================================
// Timer API polyfills (setTimeout/setInterval)
// ============================================

/**
 * Fake setTimeout - executes immediately via Promise
 * @param {Function} callback - 回调函数
 * @param {number} delay - 延迟（忽略，立即执行）
 * @param {...*} args - 传给回调的参数
 * @returns {number} timer ID
 */
if (typeof setTimeout === 'undefined') {
    const timers = new Map();
    let nextTimerId = 1;

    globalThis.setTimeout = function(callback, delay = 0, ...args) {
        const id = nextTimerId++;

        // Execute immediately (not actually async!)
        Promise.resolve().then(() => {
            if (timers.has(id)) {
                callback(...args);
                timers.delete(id);
            }
        });

        timers.set(id, { callback, type: 'timeout' });
        return id;
    };

    globalThis.setInterval = function(callback, delay = 0, ...args) {
        const id = nextTimerId++;

        // Only execute once (fake interval)
        Promise.resolve().then(() => {
            if (timers.has(id)) {
                callback(...args);
                // Note: Real setInterval would repeat, but we don't
            }
        });

        timers.set(id, { callback, type: 'interval' });
        return id;
    };

    globalThis.clearTimeout = function(id) {
        timers.delete(id);
    };

    globalThis.clearInterval = function(id) {
        timers.delete(id);
    };
}

// ============================================
// Worker API polyfill (fake single-threaded)
// ============================================

/**
 * Fake Worker - single-threaded, for API detection
 */
if (typeof Worker === 'undefined') {
    class Worker {
        constructor(scriptURL, options = {}) {
            this._id = Math.floor(Math.random() * 1000000);
            this._scriptURL = scriptURL;
            this._terminated = false;
            this.onmessage = null;
            this.onerror = null;
        }

        postMessage(message) {
            if (this._terminated) {
                throw new Error('Worker has been terminated');
            }

            // Fake processing - immediately trigger onmessage if set
            if (this.onmessage) {
                setTimeout(() => {
                    if (!this._terminated && this.onmessage) {
                        const event = {
                            type: 'message',
                            data: message,
                            origin: '',
                        };
                        this.onmessage(event);
                    }
                }, 0);
            }
        }

        terminate() {
            this._terminated = true;
        }

        addEventListener(type, listener) {
            if (type === 'message') {
                this.onmessage = listener;
            } else if (type === 'error') {
                this.onerror = listener;
            }
        }

        removeEventListener(type, listener) {
            if (type === 'message' && this.onmessage === listener) {
                this.onmessage = null;
            } else if (type === 'error' && this.onerror === listener) {
                this.onerror = null;
            }
        }
    }

    globalThis.Worker = Worker;
}

// ============================================
// Crypto random functions
// ============================================

/**
 * Crypto namespace with random functions
 */
if (typeof crypto === 'undefined') {
    globalThis.crypto = {};
}

if (!crypto.randomUUID) {
    crypto.randomUUID = function() {
        return Deno.core.ops.op_crypto_random_uuid();
    };
}

if (!crypto.getRandomValues) {
    crypto.getRandomValues = function(typedArray) {
        // Generate random hex string and fill typed array
        const length = typedArray.length;
        const hexString = Deno.core.ops.op_crypto_get_random_values(length);

        for (let i = 0; i < length; i++) {
            const hex = hexString.substr(i * 2, 2);
            typedArray[i] = parseInt(hex, 16);
        }

        return typedArray;
    };
}

// Math.random override using crypto random (optional)
globalThis.cryptoRandom = function() {
    return Deno.core.ops.op_crypto_random();
};

