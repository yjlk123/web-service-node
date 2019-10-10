// 把这个模块挪出来的原因是要用await 就要用 async, 而 async 是要放在函数最前面的，所以挪出来比较方便呐
// 为了回调的好看，引入了 promisify

const fs = require('fs')
const promisify = require('util').promisify // 注意不是直接引入的 prmissify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const Handlebars = require('handlebars')
const path = require('path')
const config = require('../config/defaultConf')
const mime = require('../helper/mime')

const tplPath = path.join(__dirname, '../template/dir.html')
// 这里如果直接写相对路径是不行的，必须使用path 拼接好的绝对路径，也就是除了require 的时候用相对路径，其他的都要用绝对路径
// 之前说尽量用异步方法，这里却用同步方法，有2个原因：1.后面的都要依赖这个文件的内容 2.只会读取一次，因为再次读取也是有缓存的
const source = fs.readFileSync(tplPath, 'utf-8')
// Handlebar 接收的是个字符串，但是如果传进去的是个文件 buffer 格式，需要用 utf-8 的方式读文件，
// 或者将读出的文件用 toString() 转一下，再调用 Handlebars.compile()
const template = Handlebars.compile(source) // 读取模板文件并用 handlebars.compile 编译成 html 文件


module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath)

        // 如果是文件，返回文件内容，注意访问时需要加上文件的后缀
        if (stats.isFile()) {
            res.statusCode = 200;
            const contentType = mime(filePath)
            res.setHeader('Content-Type', contentType); // 如果写入的内容是 html ,就应该是 'text/html'
            fs.createReadStream(filePath).pipe(res) // 如果是文件，通过文件流一点点地吐给 res, 而不是全部读取完成了才给返回

            // 这种方式效果同上，但是这个是一次性将文件内容读取后再返回，会比较慢，所以一般用上面这种文件流的方式
            // fs.readFile(filePath, data => {
            //     res.end(data)
            // })
        } else if (stats.isDirectory()) {
            // 如果是文件夹,返回该文件夹下的文件列表

            // 原始的回调：
            // fs.readdir(filePath, (err, files)=> {
            //     res.statusCode = 200;
            //     res.setHeader('Content-Type', 'text/plain'); // 如果写入的内容是 html ,就应该是 'text/html'
            //     res.end(files.join(','))
            // })

            // 修改了回调后的，效果同上且都是异步的，只是这种方式写法上看起来更清楚，一个 await 就知道是异步调用了
            const files = await readdir(filePath)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 如果写入的内容是 html ,就应该是 'text/html', 文字是：text/plain

            // 引入可视化模板后的返回数据
            const dir = path.relative(config.root, filePath) // 取出当前文件相对于config.root 的绝对路径
            const data = {
                title: path.basename(filePath), // 获取当前文件或文件夹的名称
                dir: dir ? `/${dir}` : '', // 取出当前文件相对于根路径的绝对路径
                files: files
            }

            // 简单的没有引入可视化模板时的返回
            // res.end(files.join(','))

            // 引入可视化模板后的返回
            res.end(template(data))
        }
    }catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain'); // 如果写入的内容是 html ,就应该是 'text/html'
        res.end(`${filePath} is not a directory or file \n ${e.toString()}`)
        return
    }
}
