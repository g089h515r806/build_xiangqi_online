(function () {
//alert("123456");
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const chatSend = document.querySelector('#chat-send');
  
  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }  
  let ws;

  wsButton.onclick = function () {
	 console.log("cookies", document.cookie);
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

   // ws = new WebSocket(`ws://127.0.0.1:3000/echo`);
	ws = new WebSocket(`ws://localhost:3000/echo`);
    ws.onerror = function () {
      showMessage('WebSocket error');
    };
    ws.onopen = function () {
      showMessage('WebSocket connection established');
    };

    ws.onmessage = function (res) {
      let obj = JSON.parse(res.data);
      console.log("obj", obj);
      if (obj.type === 'chat') {
        console.log("收到对手聊天信息");
        console.log("obj", obj);
        //msg
        var msg_ele = document.createElement('li');
        let msg = obj.data || "";
        msg_ele.innerHTML =   '<span class="chat-owner">对手</span>'  + msg;
        document.querySelector('#chat-list').appendChild(msg_ele);			
          //userNameSpan.innerHTML = obj.data;
      }
    };

    ws.onclose = function () {
      showMessage('WebSocket connection closed');
      ws = null;
    };
  }; 
  
chatSend.onclick = function () {  
    var edit_message = document.querySelector('#edit-message');
    var msg = edit_message.value.trim() || "";
    if(msg ===""){
      return;
    }

    var msg_ele = document.createElement('li');
    msg_ele.innerHTML =  msg + '<span class="chat-owner">自己</span>' ;
    document.querySelector('#chat-list').appendChild(msg_ele);

    let msgObj = {
      type:'chat',  
      //tableId:1, 
      data:msg, 
    };
  
    ws.send(JSON.stringify(msgObj));
    edit_message.value = '';

};   
 /* 
//var ws = new WebSocket("ws://127.0.0.1:3000/echo?token=123456");
let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmE4ZGYyNzkzOTZiODRiMTc5NjlhNCIsIm5hbWUiOiJhZG1pbiIsImlhdCI6MTY3MzYxNDk1MywiZXhwIjoxNjczNjI5MzUzfQ.1a1GgOcEVQjA4dNYjYM8wRZN3nZb4ozu8T_6UZvmfkY";
//let token ="eyJhbGciOiJIUzI1NiIs";
var ws = new WebSocket("ws://127.0.0.1:3000/echo?token=" + token);

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
*/

})();