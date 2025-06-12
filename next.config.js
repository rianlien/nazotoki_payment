// nazotoki_payment/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 既存の設定 ...

  webpack: (config, { isServer }) => {
    // developmentモードでの eval() 使用を許可するためのdevtool設定
    if (config.mode === 'development') {
      config.devtool = 'inline-source-map';
    }

    // node-fetchなど一部のライブラリがサーバーサイドで使うfsモジュールの問題回避
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        // 👇 ここに pino-pretty の解決も追加します 👇
        "pino-pretty": false,
        "stream": false, // pinoが依存する可能性のあるstreamモジュールも
        "os": false,     // pinoが依存する可能性のあるosモジュールも
      };
    }

    // サーバーサイドでのみ pino-pretty を外部モジュールとして扱う
    // クライアントサイドのバンドルには含めないようにする
    if (isServer) {
      config.externals.push('pino-pretty');
    }

    return config;
  },
};

module.exports = nextConfig;