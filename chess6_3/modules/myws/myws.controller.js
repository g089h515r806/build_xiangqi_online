//import Todo from './todo.model';

let clients = new Map([]);
//参考：
//https://blog.csdn.net/DragonOfMoon/article/details/125517816

//https://blog.csdn.net/weixin_44691608/article/details/110646361

class MywsController {

  /**
   * Get all contact
   * @param {req, res, next} Express param
   */
  echo(ws, req) {
	  
	 // console.log("req", req);
	  console.log("cookiews", req.cookies);
	  console.log("auth", req.auth);

	  let id = req.auth.id || "";
	  let name = req.auth.name || "";
	  //如果获取不到信息，关闭ws
	  if(id === "" || name === "" ){
		ws.close();
		return;
	  }
  
	  //将这两个属性赋值给ws,方便后面获取
	  ws.name = name;
	  ws.id = id;
	  clients.set(id, ws);	
	  
	  console.log("clients", clients);
	  	  
	// me.clients.push(ws);
	 /* 
	ws.on('upgrade', function open() {
	  console.log('upgrade handshake');
	  ws.send(Date.now());
	});		
	
	ws.on('connection', function connection() {
	  console.log('connected');
	  ws.send(Date.now());
	});	  
	*/
	  //console.log("req", req);
	ws.on('message', function message(msg) {
		console.log("message", msg);
		//聊天逻辑
		let msgObj = JSON.parse(msg);
		let type = msgObj.type || "";	
		if(msgObj.type === "chat"){
			clients.forEach(function each(client) {	
				//if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
				if (client.id !== ws.id) {	  
				  client.send(JSON.stringify(msgObj));
				}
			  });			
		}
		
		if(msgObj.type === "move"){
			clients.forEach(function each(client) {	
				//if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
				if (client.id !== ws.id) {	  
				  client.send(JSON.stringify(msgObj));
				}
			  });			
		}		
		//ws.send(msg);
	  });
	  
	ws.on('close', function close() {
	  console.log('disconnected');
	});	  
  }
  



  /* eslint-enable no-param-reassign */
}

export default new MywsController();
