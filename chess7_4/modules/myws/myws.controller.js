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
            case "op_join": opJoinCallback(ws, msgObj); break;
			case "op_ready": opReadyCallback(ws, msgObj); break;
			case "op_leave": opLeaveCallback(ws, msgObj); break;

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


//向游戏的参与者与旁观者同时发送消息
function sendToAllUsers(ws, msgObj){

	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	let players = gameTable.players ||  [];
	let onlookers = gameTable.onlookers ||  [];
	//向消息里面增加发消息的用户信息
    msgObj.user = {
		id:ws.id,
		name:ws.name,
	}	
	
	players.forEach(function each(player) {
	//clients.forEach(function each(client) {	
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  let client = clients.get(player.id);
	  client.send(JSON.stringify(msgObj));
	});		
	//
	onlookers.forEach(function each(onlooker) {
	//clients.forEach(function each(client) {	
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  let client = clients.get(onlooker.id);
	  client.send(JSON.stringify(msgObj));
	});	
}

//向游戏的参与者与旁观者同时发送消息
function sendToOtherUsers(ws, msgObj){

	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	let players = gameTable.players ||  [];
	let onlookers = gameTable.onlookers ||  [];
	//向消息里面增加发消息的用户信息
    msgObj.user = {
		id:ws.id,
		name:ws.name,
	}	
	
	players.forEach(function each(player) {
	//clients.forEach(function each(client) {	
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  let client = clients.get(player.id);
	  client.send(JSON.stringify(msgObj));
	});		
	//
	onlookers.forEach(function each(onlooker) {
	//clients.forEach(function each(client) {	
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  if (client.id !== ws.id) {	  
	    let client = clients.get(onlooker.id);
	    client.send(JSON.stringify(msgObj));
	  }
	});	
}

//向游戏的参与者同时发送消息
function sendToPlayers(ws, msgObj){

	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	let players = gameTable.players ||  [];
	
	//向消息里面增加发消息的用户信息
    msgObj.user = {
		id:ws.id,
		name:ws.name,
	}	
	//let onlookers = gameTable.onlookers ||  [];
	players.forEach(function each(player) {
	//clients.forEach(function each(client) {	
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  let client = clients.get(player.id);
	  client.send(JSON.stringify(msgObj));
	});		

}

//向游戏的对手同时发送消息
function sendToOpponentPlayer(ws, msgObj){

	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	let players = gameTable.players ||  [];
	
	//向消息里面增加发消息的用户信息
    msgObj.user = {
		id:ws.id,
		name:ws.name,
	}	

	players.forEach(function each(player) {

	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  let client = clients.get(player.id);
	  if (client.id !== ws.id) {
	    client.send(JSON.stringify(msgObj));
	  }
	});		

}

//chat回调函数
function chatCallback(ws, msgObj){
	sendToAllUsers(ws, msgObj);
	//这里有一个bug， chess9后面修正了，
}
/*
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
*/

//move回调函数
function moveCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	//let tableClients = gameTable.clients ||  new Set();
	
	let move = msgObj.data || "";
	//招法必须有效，暂时不做检查
	if(move === ""){
		return;
	}
	//调整游戏信息，招法记录在案
	gameTable.moves.push(move);
	//轮次加1
	gameTable.turnNo = gameTable.turnNo + 1;
	//其它设置，比如，红方时间，黑方时间，
	//TODO 
	
	let isMate = msgObj.isMate || 0;
	if(isMate ===1){
		//todo 检查是否确实绝杀，如果没有的话，忽略
		gameTable.state = 2;
	}
	
	sendToOtherUsers(ws, msgObj);

}
/*
function moveCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	//let gameTable = gameTables.get(tableId);
	//let tableClients = gameTable.clients || [];
	//id不同于当前id
	//tableClients.forEach(function each(client) {
	clients.forEach(function each(client) {		
	  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
	  //if (client.id !== ws.id) {	  
		client.send(JSON.stringify(msgObj));
	  //}
	});		
}
*/

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


//op_join回调函数
function opJoinCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	
	let players = gameTable.players|| [];
	let msgObjRet = {};
	if(players.length >=2){
		//游戏人数超过2，不能加入
	    msgObjRet	= {
				type : 'system_msg',  //显示信息
				data : "当前游戏已满，您暂时无法加入"		
		}
		
		ws.send(JSON.stringify(msgObjRet));	
		
		return;
        		
	}
	
	//将用户信息（基本信息存在ws里面） 添加到players里面，
	players.push({
	  id:ws.id,
	  name:ws.name,
	});
	
	//我们将用户的id，存到clients下面
    
	//let clients = gameTable.clients || new Set();
	
	//clients.add(ws.id);
	
	//修改游戏信息
	gameTable.players = players;
	//gameTable.clients = clients;	
	gameTables.set(tableId, gameTable);

	sendToAllUsers(ws, msgObj);		
		
}

//opReadyCallback
function opReadyCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	let msgObjRet = {};
	
	let players = gameTable.players|| [];
	
	let readyCnt = 0;
	
	for(let i=0; i<players.length; i++){
		let player = players[i];
		if(player.id === ws.id){
			player.isReady = 1;
			//这里需要重新赋值吗？
			players[i] = player;
			
			readyCnt ++;
		}else{
			let isReady = player.isReady || 0;
			if(isReady ===1){
				readyCnt ++;
			}
		}
	}

	
	//修改游戏信息， 是否默认已经修改？这里的代码必须的吗？
	gameTable.players = players;
	gameTables.set(tableId, gameTable);	
	
	console.log("gameTable", gameTable);
	if(readyCnt < 2){
		//发送消息
		sendToAllUsers(ws, msgObj);		
        /*
		msgObjRet	= {
				type : 'ready_success',  //加入成功
				tableId: tableId,
				data : "准备成功"		
		}
		
		ws.send(JSON.stringify(msgObjRet));	
		*/
	}else{
		//players[0].isRed = 1 ;
		
		//可以随机的确定，也可以指定第一个红方，后面两人继续对弈，交换先后手，
		let state = gameTable.state || 0;
		let redPlayer = "";
		let blackPlayer = "";		
		if(state === 0){
			redPlayer = players[0].name || "";
			blackPlayer = players[1].name || "";
			players[0].isRed  = 1;
		}else if(state === 2){     //如果是再来一局，则交换先后手
			redPlayer = players[1].name || "";
			blackPlayer = players[0].name || "";
            players[1].isRed  = 1;			
		}

		
		
		/*
		msgObjRet	= {
				type : 'game_start',  //游戏开始
				tableId: tableId,
				data : {
					redPlayer:redPlayer,
				}		
		}
		*/
		
		
		//设置游戏信息
		gameTable.red = redPlayer;
		gameTable.black = blackPlayer;
		//游戏状态置为开始，消息里面发送后台gameTable信息,主要是后台做了设置，比如谁先手
		gameTable.state = 1;
		msgObj.gameTable = gameTable;
		
		sendToAllUsers(ws, msgObj);	
		
		/*
			let tableClients = gameTable.clients ||  new Set();
			//id不同于当前id clients
			tableClients.forEach(function each(client) {
			//clients.forEach(function each(client) {	
			  //if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
			  if (client.id !== ws.id) {	  
				ws.send(JSON.stringify(msgObjRet));	
			  }
			});	
         */		
		
				
	}
	
	
	console.log("gameTable2", gameTable);
		
	
	return;	
	
}

//opLeaveCallback
function opLeaveCallback(ws, msgObj){
	let tableId = msgObj.tableId || "";
	let gameTable = gameTables.get(tableId);
	
	let state = gameTable.state || 0;
	//1为游戏中，此时不能离开
	if(state === 1 ){
		return;
	}
	
	//2为游戏结束，如果有人离开，将状态置为0
	if(state === 2 ){
		gameTable.state = 0;
	}	
	
	//发送消息
	sendToAllUsers(ws, msgObj);
	
	let players = gameTable.players|| [];
	
	let playersNew = [];
	for(let i = 0; i < players.length; i++){
		let player = players[i];
		if(player.id === ws.id){
			//players[i] = {};
		}else{
			playersNew.push(player);
		}
	}

	
	//修改游戏信息， 是否默认已经修改？这里的代码必须的吗？
	gameTable.players = playersNew;
	
	let onlookers = gameTable.onlookers || [];
	let onlookersNew = [];
	for(let i = 0; i < onlookers.length; i++){
		let onlooker = onlookers[i];
		if(onlooker.id === ws.id){
			//players[i] = {};
		}else{
			onlookersNew.push(onlooker);
		}
	}	
	//clients.delete(ws.id);
	
	gameTable.onlookers = onlookersNew;
	gameTables.set(tableId, gameTable);


	
}



export default new MywsController();
