// 本文件是效果同original-server,但是这个引入了 promisify, 对回调更加直观和友好

// 启动一个 web 服务器的原始写法

const http = require('http')
const conf = require('./config/defaultConf')
const path = require('path')
const route = require('./helper/route')

const server = http.createServer((req, res) => {
    // req.url 是发送请求的地址
    const filePath = path.join(conf.root, req.url)
    route(req, res, filePath)

});

server.listen(conf.port, conf.hostname, () => {
    console.log(`服务器运行在 http://${conf.hostname}:${conf.port}/`);
});



