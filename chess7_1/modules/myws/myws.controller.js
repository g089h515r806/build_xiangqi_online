//import Todo from './todo.model';
import sizeof from 'object-sizeof'

let clients = new Map();
let gameTables = new Map();

//游戏桌设置，固定20个，后面允许用户添加，最多添加到100个
//游戏桌子信息放在内存里面，为了防止内存溢出，可以将最大值设置的小一点，实际一台机子应该可以承受，几千甚至上万人同时在线，
let fixGameTableNumber = 20;
let maxGameTableNumber = 100;

//我们初始化20个游戏桌
for (let i = 1; i <= 20; i++) { 
	gameTables.set(i, {
		id:i,         //游戏桌的ID号
		players:[],  //游戏参与者
		onlookers:[],  //存储游戏旁观者的ID,name信息，方便获取对应的ws连接，发送对应消息，
		ops:[],         //游戏过程中操作的记录，
		moves:[],       //招法
		state:0,        //游戏状态， 0.游戏前， 1，游戏中，2，游戏结束
		turnNo:1,   //轮次，该谁下棋了，从1开始，红先黑后
		red:"",      //红方名字
		black:"",    //黑方方名字
		initFen:"",
		type:"default",   //"auto",  "default", 自动匹配，默认、好友场、
		settings:{}	  //游戏设置，比如时长，加时，是否允许旁观？
	});
  }
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
	//  console.log("cookiews", req.cookies);
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
	
	console.log('wssize:',sizeof(ws))
	console.log('mapsize:',sizeof(clients))

    listInfo(ws);	
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
		//消息的数据类型支持buffer，字符串，我们这里使用字符串，确切的说，是json字符串，
		//对于json解析出来的数据格式
		/*
		//iccs格式的招法
		{
			type : 'move',
			tableId:"1",
			data : 'h2e2'
		}
		
		{
			type : 'chat',
			tableId:"1",
			data : '快点吧，我等的花儿都谢了'
		}	

		{
			type : 'op_withdraw',  //悔棋
			tableId:"1",
			data : ''
		}
		{
			type : 'op_ready',  //准备开始
			tableId:"1",
			data : ''
		}	
		{
			type : 'op_giveup',  //认输
			tableId:"1",
			data : ''
		}	
		{
			type : 'op_draw',  //提和
			tableId:"1",
			data : ''
		}
		
		{
			type : 'op_join',  //加入 游戏桌
			tableId:"1",
			data : ''
		}	

		{
			type : 'op_join',  //加入
			tableId:"1",
			data : ''
		}	
		{
			type : 'op_lookon',  //旁观
			tableId:"1",
			data : ''
		}
		
		{
			type : 'op_leave',  //离开
			tableId:"1",
			data : ''
		} 
		{
			type : 'op_quit',  //强退
			tableId:"1",
			data : ''
		} 
		
		
		*/
		//聊天逻辑
		let msgObj = JSON.parse(msg);
		let type = msgObj.type || "";
		let tableId = msgObj.tableId || "";
		//使用switch 代替 if语句
		switch(type) {
			case "chat": chatCallback(ws, msgObj); break;
			case "move": moveCallback(ws, msgObj); break;

			default : ws.send(msg);
		}		
		/*
		if(msgObj.type === "chat"){
			let gameTable = gameTables.get(tableId);
			let tableClients = gameTable.clients || [];
			//id不同于当前id
		    tableClients.forEach(function each(client) {
			  if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
				client.send(msg);
			  }
			});			
		}
		
		//走棋逻辑	
		if(msgObj.type === "move"){
			let gameTable = gameTables.get(tableId);
			let tableClients = gameTable.clients || [];
			//id不同于当前id
		    tableClients.forEach(function each(client) {
			  if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
				client.send(msg);
			  }
			});			
		}	
       */		
		//ws.send(msg);
	  });
	  
	ws.on('close', function close() {
	  console.log('disconnected');
	});	  
  }
  



  /* eslint-enable no-param-reassign */
}

//chat回调函数
function chatCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	//let gameTable = gameTables.get(tableId);
	//let tableClients = gameTable.clients || [];
	//id不同于当前id clients
	//tableClients.forEach(function each(client) {
	clients.forEach(function each(client) {	
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  if (client.id !== ws.id) {	  
		client.send(JSON.stringify(msgObj));
	  }
	});		
}

//move回调函数
function moveCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	//let gameTable = gameTables.get(tableId);
	//let tableClients = gameTable.clients || [];
	//id不同于当前id
	//tableClients.forEach(function each(client) {
	clients.forEach(function each(client) {		
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  if (client.id !== ws.id) {	  
		client.send(JSON.stringify(msgObj));
	  }
	});		
}

//列出象棋桌子，当前用户信息
function listInfo(ws){
	
    let tables = [];
    gameTables.forEach(function each(gameTable) {	
	  //TODO,需要做一些转换？
	  tables.push(gameTable);
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {

	});	

    let msgObj	= {
			type : 'list_info',  //列出信息
			data : {
				tables:tables,
				clients:[]
			}		
	}
	
	ws.send(JSON.stringify(msgObj));
	
}

export default new MywsController();
