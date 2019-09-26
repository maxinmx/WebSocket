var ws = require("nodejs-websocket");
var Port = 8001;
var clientCount = 0;
 
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection");
    clientCount ++;
    conn.nickName = 'User' + clientCount;
    var obj = {}
    obj.type = 'Enter';
    obj.data = conn.nickName + '进入聊天室';
    // 广播
    brodcast(JSON.stringify(obj));

    conn.on("text", function (str) {
        console.log("Received "+ str);
        var obj = {}
        obj.type = 'Message';
        obj.data = conn.nickName + ' says: ' + str;
        // 当设置心跳检测时使用
        if (str !== '心跳值') {
            brodcast(JSON.stringify(obj));
        } else {
            brodcast(JSON.stringify(''));
        }
        // 当未设置心跳检测时使用
        // brodcast(JSON.stringify(obj));
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        var obj = {}
        obj.type = 'Leave';
        obj.data = conn.nickName + '退出聊天室';
        brodcast(JSON.stringify(obj));
    });
    conn.on("error", function(err) {
        console.log('websocket 连接错误', err);
    });
}).listen(Port)
console.log('服务端启动');

function brodcast(str) {
    server.connections.forEach(function(connection) {
        connection.sendText(str);
    })
}

// 关闭服务器
//  function serverClose () {
//      setTimeout(function() {
//          server.close(function() {
//              console.log('服务器切断服务');
//          });
//      }, 5000)
//  }
//  serverClose();
