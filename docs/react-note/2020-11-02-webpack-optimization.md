---
order: 2
title: webpack优化
group:
    title: React
    order: 1
---

# splitChunks

```
      splitChunks: {
        chunks: 'all',
        name: false,
        maxInitialRequests: Infinity,
        
        minSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        // name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -2
          },
          default: {
            minChunks: 2,
            priority: 2,
            reuseExistingChunk: true
          },
          common: {
            name: "common",
            chunks: "all",
            priority: 2,
            minChunks: 2,
          },
          styles: {
            name: 'styles',
            test: /\.(css|less)$/,
            chunks: 'all',
            enforce: true,
            priority: 20,
          }
        }
      },
      ```