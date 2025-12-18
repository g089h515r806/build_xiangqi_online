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
		ws.send(msg);
	  });
	  
	ws.on('close', function close() {
	  console.log('disconnected');
	});	  
  }
  



  /* eslint-enable no-param-reassign */
}

export default new MywsController();
