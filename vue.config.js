const { defineConfig } = require('@vue/cli-service')
let proxyObj = {};
proxyObj["/"] = {
    ws:false, // shutdown webSocket
    target: "http://localhost:8081", // backend address
    changeOrigin: true,
    pathRewrite: {
        '^/api':'/'
    }
}

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config.plugin('define').tap(definitions => {
            Object.assign(definitions[0]['process.env'], {
                ws:false,
                NODE_HOST: '"http://localhost:8081"',
            });
            return definitions;

        });
    },
    devServer: {
        client: {
            overlay: false,
        },
        port: 8080,
        proxy: proxyObj,
        host: "localhost"
    }
})