// 启动一个 web 服务器的使用 express 写法

//express_demo.js 文件
var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')

function formatData (data) {
    var res = {
        '_embedded': {},
        'page': {}
    }
    res['_embedded'] = JSON.parse(data)
    res['page'] = { 'size': 20, 'totalElements': 20, 'totalPages': 1, 'number': 0 }
    return JSON.stringify(res)
}

/*用户登录处理*/
app.use(bodyParser.json())
app.post('/login', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    var user = {
        id: 1,
        username: req.body.username
    }
    var json = JSON.stringify({
        isOk: true,
        user: user
    })
    res.end(json)
})

/*用户退出处理*/
app.use(bodyParser.json())
app.post('/logout', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.end()
})

/*获取用户列表*/
app.get('/api/secUsers', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    let filePath = 'user.json'
    fs.readFile(filePath, 'utf8', function (err, data) {
        res.end(formatData(data))
    })
})

/*获取用户详细信息*/
app.get('/api/secUsers/:id', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    let filePath = 'user.json'
    // 首先我们读取已存在的用户
    fs.readFile(filePath, 'utf8', function (err, data) {
        data = JSON.parse(data)
        var users = data['secUsers']
        var user = {}
        for (var i = users.length - 1; i >= 0; i--) {
            if (users[i].id == req.params.id) {
                user = users[i]
                break
            }
        }

        res.end(JSON.stringify(user))
    })
})

app.use(bodyParser.json())
/*新增用户*/
app.post('/api/secUsers', function (req, res) {
    let filePath = 'user.json'
    fs.readFile(filePath, 'utf8', function (err, data) {
        data = JSON.parse(data)
        var users = data['secUsers']
        var ids = []
        for (var index in users) {
            ids.push(users[index].id)
        }
        var maxId = ids.sort(function (a, b) {
            return b - a
        })[0]
        var user = req.body
        user.id = maxId + 1
        data['secUsers'].push(user)
        fs.writeFile(filePath, JSON.stringify(data), function (err) {
            res.end()
        })
    })
})

/*编辑用户*/
app.post('/api/secUsers/:id', function (req, res) {
    let filePath = 'user.json'
    fs.readFile(filePath, 'utf8', function (err, data) {
        data = JSON.parse(data)
        var users = data['secUsers']
        for (var i = 0; i >= users.length; i++) {
            if (users[i].id == req.params.id) {
                users.data.splice(i, 1)
                break
            }
        }

        var user = req.body
        user.id = req.params.id
        data['secUsers'].push(user)
        fs.writeFile(filePath, JSON.stringify(data), function (err) {
            res.end()
        })
    })
})

app.use(bodyParser.json())
/*删除用户*/
app.post('/api/secUsers/delete', function (req, res) {
    let filePath = 'user.json'
    fs.readFile(filePath, 'utf8', function (err, data) {
        data = JSON.parse(data)
        var users = data['secUsers']
        for (var i = 0; i >= users.length; i++) {
            if (users[i].id == req.body.params.id) {
                users.data.splice(i, 1)
                break
            }
        }

        fs.writeFile(filePath, JSON.stringify(data), function (err) {
            res.end()
        })
    })
})

app.get('/portal/user/center/user/info', function (req, res) {
    let permissionRoutes = {
        data: {
            userInfo: {},
            menuInfo: [
                {
                    path: 'first',
                    name: 'first',
                    menuName: '多级菜单1',
                    icon: 'el-icon-location',
                    menuId: 'r001',
                    ifMenu: true,
                    redirect: '/home',
                    pid: null,
                    children: [
                        {
                            path: 'child',
                            name: 'child',
                            ifMenu: true,
                            icon: 'fa fa-user',
                            redirect: '/home',
                            menuName: '多级菜单1-1',
                            children: [{
                                path: 'workbench',
                                name: 'workbench',
                                icon: 'fa fa-user',
                                menuName: '工作台',
                                ifMenu: true,
                                menuId: 'r004',
                                pid: 'r001'
                            }]
                        }]
                }, {
                    path: 'information',
                    name: 'information',
                    menuName: '企业通知',
                    menu: false,
                    ifMenu: true,
                    meta: {}
                }, {
                    path: 'platform',
                    name: 'platform',
                    menuName: '平台私信',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }, {
                    path: 'workorder',
                    name: 'workorder',
                    menuName: '企业工单',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }, {
                    path: 'platformutil',
                    name: 'platformutil',
                    menuName: '平台工具',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }, {
                    path: 'resourceshop',
                    name: 'resourceshop',
                    menuName: '资源商店',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }, {
                    path: 'myresource',
                    name: 'myresource',
                    menuName: '我的资源',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }, {
                    path: 'addressbook',
                    name: 'addressbook',
                    menuName: '通讯录',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }, {
                    path: 'development',
                    name: 'development',
                    menuName: '开发设置',
                    ifMenu: true,
                    menu: false,
                    meta: {}
                }
            ]
        }
    }

    let dataInfo = {
        "code": 0,
        "msg": null,
        "success": true,
        "data": {
            "userInfo": {
                "userId": "100002",
                "userEmail": "yanjianhong@bonc.com.cn",
                "userMobile": "17793230116",
                "password": "7c4a8d09ca3762af61e59520943dc26494f8941b",
                "userName": "yjh",
                "userIdentity": "上级",
                "userRealName": "realname11111",
                "userBirthday": null,
                "qqOpenid": null,
                "wechatOpenid": null,
                "memo": "123",
                "userStatus": 1,
                "createDate": 1555928130000,
                "updateDate": null,
                "createUser": "100000",
                "pwdExpireDate": null,
                "gender": null,
                "roleId": "r0002"
            },
            "role": "企业管理员",
            "menuInfo": [{
                "id": "04d8fc3d-6fa8-11e9-ba40-52540092",
                "menuName": "工作台",
                "pid": null,
                "path": "workbench",
                "name": "workbench",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "056c8299-6fa8-11e9-ba40-52540092",
                "menuName": "企业通知",
                "pid": null,
                "path": "information",
                "name": "information",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "05e5cf4b-6fa8-11e9-ba40-52540092",
                "menuName": "平台私信",
                "pid": null,
                "path": "platform",
                "name": "platform",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "065726bb-6fa8-11e9-ba40-52540092",
                "menuName": "企业工单",
                "pid": null,
                "path": "workorder",
                "name": "workorder",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "06d4d430-6fa8-11e9-ba40-52540092",
                "menuName": "平台工具",
                "pid": null,
                "path": "platformutil",
                "name": "platformutil",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "072fa4f8-6fa8-11e9-ba40-52540092",
                "menuName": "资源商店",
                "pid": null,
                "path": "resourceshop",
                "name": "resourceshop",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "078c6bc9-6fa8-11e9-ba40-52540092",
                "menuName": "我的资源",
                "pid": null,
                "path": "myresource",
                "name": "myresource",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "07f3cf99-6fa8-11e9-ba40-52540092",
                "menuName": "通讯录",
                "pid": null,
                "path": "addressbook",
                "name": "addressbook",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }, {
                "id": "085a5513-6fa8-11e9-ba40-52540092",
                "menuName": "开发设置",
                "pid": null,
                "path": "development",
                "name": "development",
                "icon": "el-icon-location",
                "ifMenu": 1,
                "children": [],
                "root": true
            }],
            "companyInfo": {
                "companyId": "300166",
                "scaleId": null,
                "natureId": null,
                "displayName": "bonc",
                "companyAddress": "北京市朝阳区来广营创达三路1号院1号楼东方国信大厦",
                "companyLogo": null,
                "websiteAddress": "https://www.bonc.com.cn/",
                "introduction": "东方国信成立于1997年，是中国领先的大数据上市科技公司（股票代码 300166）。自成立以来，东方国信就专注于大数据领域，紧跟全球大数据技术的发展趋势，通打造了面向大数据采集、汇聚、处理、存储、分析、挖掘、应用、管控为一体的大数据核心能力，构建了以大数据",
                "createUser": "jxw",
                "createDate": 1555928588000,
                "updateDate": null
            },
            "departInfo": [{
                "departId": null,
                "departName": "部门1",
                "pid": null,
                "companyId": null,
                "createUser": null,
                "createDate": 1557392523680,
                "updateDate": 1557392523680
            }, {
                "departId": null,
                "departName": "部门2",
                "pid": null,
                "companyId": null,
                "createUser": null,
                "createDate": 1557392523680,
                "updateDate": 1557392523680
            }]
        }
    }

    res.send(permissionRoutes)
})

app.post('portal/address/book/address/list', function (req, res) {
    let result = {
        data: {
            data: {},
            code: 0
        }
    }
    res.send(result)
})

var server = app.listen(8089, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('应用实例，访问地址为 http://%s:%s', host, port)
})
