/*
增加心跳检测
*/

var isConnect = false;
var conTimer;
var createWebSocket = function() {
  try {
    if ('WebSocket' in window) {
      ws = new WebSocket('ws://localhost:8001/');
    } else {
      // 提示不支持websocket
      console.log('不支持websocket')
    }
    handleEvent();
  } catch(e) {
    reconnect();
    console.log(e);
  }
}

var handleEvent = function() {
  if (ws) {
    ws.onclose = function() {
      reconnect();
      // console.log('连接关闭');
    };
    ws.onerror = function() {
      reconnect();
      // console.log('连接错误');
    };
    ws.onopen = function() {
      // 重置心跳值
      heartCheck.start();
      console.log('websocket 连接开始');
      document.getElementById("sendBtn").onclick = function() {
        var text = document.getElementById('sendText').value;
        if (text) {
          ws.send(text);
        }
      }
    };
    ws.onmessage = function(e){
      // 重置心跳值
      heartCheck.start();
      console.log('websocket 接收数据', e.data);
      const obj = JSON.parse(e.data);
      showMessage(obj.type, obj.data);
    }
  }
}

var reconnect = function() {
  if (isConnect) return;
  isConnect = true;
  conTimer && clearTimeout(conTimer);
  conTimer = window.setTimeout(function(){
    createWebSocket();
    isConnect = false;
  }, 2000);
}

var heartCheck = {
  timeout: 30001,
  timeoutObj: undefined,
  serverTimeoutObj: undefined,
  start(){
    const self = this;
    self.timeoutObj && clearTimeout(self.timeoutObj);
    self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
    self.timeoutObj = window.setTimeout(function() {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      ws && ws.send('心跳值');
      // 服务器端断开连接
      self.serverTimeoutObj = window.setTimeout(function() {
        console.log(ws);
        ws && ws.close();
      }, self.timeout);
    }, self.timeout)
  }
}
function showMessage(type, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  if (type === 'Enter') {
    div.style.color = 'blue';
  } else if (type === 'Leave') {
    div.style.color = 'red';
  }
  document.body.appendChild(div)
}

createWebSocket();

// var ws = new WebSocket('ws://localhost:8001/');

// function showMessage(type, str) {
//   var div = document.createElement('div');
//   div.innerHTML = str;
//   if (type === 'Enter') {
//     div.style.color = 'blue';
//   } else if (type === 'Leave') {
//     div.style.color = 'red';
//   }
//   document.body.appendChild(div)
// }
// ws.onopen = function() {
//   console.log('websocket 连接开始');
//   document.getElementById("sendBtn").onclick = function() {
//     var text = document.getElementById('sendText').value;
//     if (text) {
//       ws.send(text);
//     }
//   }
//   // document.getElementById('recv').innerHTML = 'Connected';
// }
// ws.onclose = function() {
//   console.log('websocket 连接关闭');
// }
// ws.onmessage = function(e) {
//   console.log('websocket 接收数据', e.data);
//   // document.getElementById('recv').innerHTML = e.data;
//   const obj = JSON.parse(e.data);
//   showMessage(obj.type, obj.data);
// }
// ws.onerror = function() {
//   console.log('websocket 连接错误');
// }
