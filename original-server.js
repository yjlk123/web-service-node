// 启动一个 web 服务器的原始写法

const http = require('http')
const conf = require('./config/defaultConf')
const path = require('path')
const fs = require('fs')

const server = http.createServer((req, res) => {
    // req.url 是发送请求的地址
    const filePath = path.join(conf.root, req.url)
    fs.stat(filePath, (err, stats)=> {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain'); // 如果写入的内容是 html ,就应该是 'text/html'
            res.end(`${filePath} is not a directory or file`)
            return
        }
        // 如果是文件，返回文件内容，注意访问时需要加上文件的后缀
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain'); // 如果写入的内容是 html ,就应该是 'text/html'
            fs.createReadStream(filePath).pipe(res) // 如果是文件，通过文件流一点点地吐给 res
            // 这种方式效果同上，但是这个是一次性将文件内容读取后再返回，会比较慢，所以一般用上面这种文件流的方式
            // fs.readFile(filePath, data => {
            //     res.end(data)
            // })
        } else if (stats.isDirectory()) {
            // 如果是文件夹,返回该文件夹下的文件列表
            fs.readdir(filePath, (err, files)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain'); // 如果写入的内容是 html ,就应该是 'text/html'
                res.end(files.join(','))
            })
        }
    })

    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain'); // 如果写入的内容是 html ,就应该是 'text/html'
    //
    // res.write(filePath)
    // res.end('Hello, World!\n'); // 最后一句话一定要 end, 因为是流的形式
});

server.listen(conf.port, conf.hostname, () => {
    console.log(`服务器运行在 http://${conf.hostname}:${conf.port}/`);
});
