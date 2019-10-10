// 自动根据返回的文件类型，添加不同的 Content-Type, 可以直接粘贴网上的列表

const path = require('path')

const mimeType = {
    'css': 'text/css',
    'xml': 'text/xml',
    'html': 'text/html',
    'txt': 'text/plain'
}

module.exports = (filePath) => {
    // 获取文件的拓展名，可能有多个.分割，取最后一个拓展名
    let ext = path.extname(filePath).split('.').pop().toLowerCase()
    if (!ext) {
        ext = filePath
    }
    return mimeType[ext] || mimeType['txt']
}
