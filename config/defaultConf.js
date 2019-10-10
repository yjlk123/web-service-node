module.exports = {
    root: process.cwd(), // 把用户当前的文件夹位置作为根目录,process.cwd() 是会随着调用时当前路径的改变而改变的
    hostname: '127.0.0.1',
        port: 8099,
    compress: /\.(html|js|css|md)/ // 压缩等没有记录代码
};
