const net = require('net')
const chatServer = net.createServer()
const clientList = []
chatServer.on('connection',client => {
    client.write('Hi!\n')
    clientList.push(client)
    client.on('data',data => {
        console.log('receive:',data.toString())
        clientList.forEach(v => {
            v.write(data)
        })
    })
})
chatServer.listen(9000)


// 使用方法在 控制台终端  打开多个窗口  输入如：  telent localhost 9000  就可以互相聊天