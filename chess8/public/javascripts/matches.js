(function () {
//alert("123456");
/*
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  
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

    //ws = new WebSocket(`ws://127.0.0.1:3000/echo`);
	ws = new WebSocket(`ws://localhost:3000/echo`);
    ws.onerror = function () {
      showMessage('WebSocket error');
    };
    ws.onopen = function () {
      showMessage('WebSocket connection established');
    };
    ws.onclose = function () {
      showMessage('WebSocket connection closed');
      ws = null;
    };
  };  
  */
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