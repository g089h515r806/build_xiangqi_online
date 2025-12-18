
//var init_fen = getParams("fen") || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
var canvas_cb = document.getElementById('chessboard');
var context_cb = canvas_cb.getContext('2d');
data.canvas_cb = canvas_cb;
data.context_cb = context_cb;	

let countDownInterval = null;  

//initChess();  

  //const messages = document.querySelector('#messages');
  //const wsButton = document.querySelector('#wsButton');
  const chatSend = document.querySelector('#chat-send');
  
  
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

function getUserInfo(cname)
{
  let token = getCookie("token");
  var decoded = jwt_decode(token);
  console.log("decoded", decoded);
  let userInfo = {
	  id:decoded.id,
	  name:decoded.name,
  }
  return userInfo;
}





//localStorage.setItem(key,JSON.stringify({val:value,time:curtime}));
// var val = localStorage.getItem(key);//获取存储的元素
//  var dataobj = JSON.parse(val);//解析出json对象
/*  
  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }
  */
  
let ws;
initWebsocket();



//  wsButton.onclick = function () {
function initWebsocket() {	
	 //console.log("cookies", document.cookie);
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    //ws = new WebSocket(`ws://127.0.0.1:3000/echo`);
	ws = new WebSocket('ws://localhost:3000/echo');
    ws.onerror = function () {
      //showMessage('WebSocket error');
	  console.log('WebSocket error');
    };
    ws.onopen = function () {
      //showMessage('WebSocket connection established');
	  console.log('WebSocket connection established');
	  checkActiveGame();
    };
	
	//client.on('ping', heartbeat);
	//ws.on('ping', function ping() {
	//  console.log('ping recieved!');
	//});
	//ws.onping = function () {
	//	
	//};	
	
    ws.onmessage = function (res) {
        let obj = JSON.parse(res.data);
		console.log("收到信息");
		console.log("obj", obj);
		let type = obj.type || "";
		
		switch(type) {
			case "chat": chatCallback(obj); break;
			case "move": moveCallback(obj); break;
			case "system_msg": systemMsgCallback(obj); break;
			case "list_info": listInfoCallback(obj); break;
			case "op_join": opJoinCallback(obj); break;
			case "op_ready": opReadyCallback(obj); break;
			case "op_leave": opLeaveCallback(obj); break;
			case "op_undo": opUndoCallback(obj); break;
			case "op_resign": opResignCallback(obj); break;
			case "op_draw": opDrawCallback(obj); break;
			case "op_quit": opQuitCallback(obj); break;
			case "op_undo_response": opUndoResponseCallback(obj); break;
			case "op_draw_response": opDrawResponseCallback(obj); break;
			case "reconnect": reconnectCallback(obj); break;
			case "op_settings": opSettingsCallback(obj); break;
			case "op_lookon": opLookonCallback(obj); break;
			case "op_onlooker_leave": opOnlookerLeaveCallback(obj); break;

			default : ;
		}
		
    };	
    ws.onclose = function () {
      //showMessage('WebSocket connection closed');
	  console.log('WebSocket connection closed');
      ws = null;
    };
  }; 
  
chatSend.onclick = function () {  
  var edit_message = document.querySelector('#edit-message');
  var msg = edit_message.value.trim() || "";
  if(msg ===""){
	 return;
  }

/*
  var msg_ele = document.createElement('li');
  msg_ele.innerHTML =  msg + '<span class="chat-owner">自己</span>' ;
  document.querySelector('#chat-list').appendChild(msg_ele);
*/

  let msgObj = {
	type:'chat',  
	tableId:data.tableId || null, 
	data:msg, 
  };
 
  ws.send(JSON.stringify(msgObj));
  edit_message.value = '';


}; 
	
function checkActiveGame(){
  var activeTableStr = localStorage.getItem("activeTable") || "";
   console.log("activeTableStr", activeTableStr);
  if(activeTableStr === ""){
	  return;
  }
 
  var activeTable = JSON.parse(activeTableStr);
  console.log("activeTable", activeTable);
   
  let tableId = activeTable.id || null;
  if(tableId === null){
	  return;
  } 

  //如果存在一个游戏桌，没有正常退出，  
  
  let msgObj = {
	type:'reconnect',  
	tableId:tableId, 
	data:"", 
  };
 
  ws.send(JSON.stringify(msgObj));  
   
}	

  
function  gameStart(){
	//ready 按钮 disable
}  
  
//返回初始页面  
function  returnHome(){
	const tablesWrapper = document.querySelector('#tables-wrapper');
	const chessWrapper = document.querySelector('#chess-wrapper');
	tablesWrapper.classList.remove("hidden");
	chessWrapper.classList.add("hidden");
    data.tableId = null;
	localStorage.removeItem('activeTable');
}

// *****************websocket 回调函数 开始 *********************/

	
function  chatCallback(obj){
	//msg
	var msg_ele = document.createElement('li');
	let msg = obj.data || "";
	if(msg === ""){
		return;
	}
	
	let user = obj.user || {};
	
	let userName = user.name || "";
	
	
	msg_ele.innerHTML =   '<span class="chat-user">' + userName + '</span>'  + msg;
	document.querySelector('#chat-list').appendChild(msg_ele);	
	
} 
//修改设置回调
function opSettingsCallback(obj){
	console.log("opSettingsCallback in");
	let settings = obj.data || {};
	syncSettingValues(settings);
}

//重连回调
function reconnectCallback(obj){
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";	
   //如果是自己发出的，表示走法成功，无需再做操作， 也可以放到这里操作，todo
   
   if(currentUid === opUid){
	   //显示下棋界面
		const tablesWrapper = document.querySelector('#tables-wrapper');
		const chessWrapper = document.querySelector('#chess-wrapper');
		tablesWrapper.classList.add("hidden");
		chessWrapper.classList.remove("hidden");
		
		data.tableId = obj.tableId || null;
		data.gameTable = obj.gameTable || null;
		
		if(data.gameTable === null){
		  return;
		}
		
		let state = obj.gameTable && obj.gameTable.state || 0;
		initChess();		
		showPlayers();		
		//游戏还没有开始：
		if(state !== 1){

            return;			
		}
		
		
		//游戏正在进行中，需要恢复象棋的局面，
		
		data.busy = false; 
		//data.use_red = true;
		data.is_mate = false;
		
		
		var position = new Position();

		var current_step = data.current_step || 0
		var current_fen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w'	
		position.fromFen(current_fen);

		data.position = position;	
	   //var search = new Search(position, 16);
	   //var mv_bst = search.searchMain(16,4000);	 
	   //console.log("mv_bst", mv_bst);	
	   
	   let moves = obj.gameTable && obj.gameTable.moves || [];
 
       moves.forEach(function each(mv, index) {
		   let mv2 = convertIccsMovetoMv(mv);
			position.makeMove(mv2);	
		   let newfen = position.toFen();
		   let fen_list_new = data.fen_list_new;
		   //console.log('fen_list_new0', fen_list_new);
		   fen_list_new.push(newfen);	
	   }); 
	   
		let players =  obj.gameTable && obj.gameTable.players || []; 
		let currentPlayer = {};
		players.forEach(function each(player, index) {
		  let playerId = player.id || "";
		  //对弈者自己
		  if(playerId === opUid){
             currentPlayer = player;
		  }else{
			
		  }
		});	
         
	   data.use_red = currentPlayer.isRed || false; 

       let turnNo =  obj.gameTable && obj.gameTable.turnNo || 1; 
	   
       let yushu = 	turnNo % 2; 
	   //四种情况
       /*
       //余数等于1，表示该黑的走， use_red，表示是不是使用红棋	   
       if(yushu ===1 && data.use_red){
		  data.busy = false; 
	   }else if(yushu ===1 && !data.use_red){
		  data.busy = true;  
	   }else if(yushu ===0 && data.use_red){
		  data.busy = true;  
	   }else if(yushu ===0 && !data.use_red){
		  data.busy = false;  
	   }
*/
       if((yushu ===1 && data.use_red) || (yushu ===0 && !data.use_red)){
		  data.busy = false; 
	   }else{
		   data.busy = true; 
	   }
	   
      //显示棋盘
	  clearChessBoard();
	  fenDrawing(context_cb, data);		
		//showPlayers();

		showPlayerTime();
		
		countDownInterval =  setInterval(countDownFn,1000);
		
   }
}   

function moveCallback(obj){
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";	
   //如果是自己发出的，表示走法成功，无需再做操作， 也可以放到这里操作，todo
   /*
   if(currentUid === opUid){
	   //显示一个消息
	   return;
   }
   */

	
   let mv = obj.data || "";
   var position = data.position;
   //var search = new Search(position, 16);
   //var mv_bst = search.searchMain(16,4000);	 
   //console.log("mv_bst", mv_bst);	
   var mv2 = convertIccsMovetoMv(mv);
	position.makeMove(mv2);	
   var newfen = position.toFen();
   var fen_list_new = data.fen_list_new;
   //console.log('fen_list_new0', fen_list_new);
   fen_list_new.push(newfen);
   
   //如果是自己发出的，修改busy 为true，自己就不能操作棋盘了
   if(currentUid === opUid){
	   data.busy = true;	
   }else{
	   data.busy = false;
   }
   

  //增加走子的
  //var mv_iccs = position.move2Iccs(mv_bst);
  //data.moves =  data.moves + mv_iccs;   
   
  clearChessBoard();
  fenDrawing(context_cb, data);	
  
  

   if (position.isMate()) {	
   
       endGame();
		
       data.is_mate = true;
		var title = "红胜";
		if(newfen.indexOf(" b") == -1){
			title = "黑胜";  
		}		   
       setTimeout(function(){ alert(title);}, 500);
		
		return;						
	}
	
	//修改下棋者的用时，countDown 设置
	let playerTime = obj.playerTime || 0;
	
	let gameSettings = data.gameTable && data.gameTable.settings || {}
	
    let players = data.gameTable && data.gameTable.players || [];
	let countDownObj = data.countDown || {};
	
	countDownObj.stepTime = gameSettings.stepTime || 60;
    players.forEach(function each(player, index) {
	  let playerId = player.id || "";
	  //对弈者自己
	  if(playerId === opUid){
         player.time = playerTime;
	  }else{
		 countDownObj.time =  player.time || gameSettings.time || 600;
	  }
	});
	
	data.countDown = countDownObj;

	
	showPlayerTime();
	 
	//countDownInterval =  setInterval(countDownFn,1000);	
	
} 

function systemMsgCallback(obj){
	let msg = obj.data || "";
	alert(msg);
}

//悔棋回调
function opUndoCallback(obj){
	$('#undoModal').modal("show");
}

function opReadyCallback(obj){
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";	
   
   //如果后台传递了gameTable并且state置为了1，此时重新设置gameTable，让它保持前后台一致，
   let state = obj.gameTable && obj.gameTable.state || 0;
   
   if(state === 1 ){
	 data.gameTable = obj.gameTable;
	 
	 //黑方需要设置一下，默认是红方的，
     let black = obj.gameTable.black || "";
	 let currentName = userInfo.name || "";
	 if(currentName === black){
		data.busy = true; 
		data.use_red = false;
		data.is_mate = false;
		initChess();
        //clearChessBoard();
	    //fenDrawing(data.context_cb, data);
	 }else{
		 //总是重置一下，再来一局不然有bug
		data.busy = false; 
		data.use_red = true;
		data.is_mate = false;
		initChess();
        //clearChessBoard();
	    //fenDrawing(data.context_cb, data);		 
	 }
	

   //控制按钮的显示	
	const buttonRowShow = document.querySelector('.button-row.show');
	const buttonRowToShow = document.querySelector('.button-row.state-1');
	buttonRowShow.classList.remove("show");
	buttonRowToShow.classList.add("show");	 
	 
	 showPlayerTime();
	 
	countDownInterval =  setInterval(countDownFn,1000);
	
	  document.querySelector('#tips').innerHTML = "游戏开始";
	 //alert("游戏开始"); //提示,或者可以这个时候显示棋盘
     return;	 
   }
   
   let gameTable = data.gameTable || {};
   let players = gameTable.players || [];
	for(let i=0; i<players.length; i++){
        let player = players[i];
		if(player.id === opUid){
			player.isReady = 1;
		}
		//ready 按钮 disable
	}
}	

//悔棋响应处理
function  opUndoResponseCallback(obj){
	let tableId = obj.tableId || null;
	if(tableId === null){
		 return;
	}
	let responseData = obj.data || "";
	if(responseData === "agree"){
		  // 如果走法数组不为空，那么就撤销一步棋
		var position = data.position;
		var fen_list_new = data.fen_list_new;
		if (position.mvList.length > 1) {
		  position.undoMakeMove();
		  fen_list_new.pop();
		  //data.moves = data.moves.substr(0, (data.moves.length-4));
		  
		}	
		if (position.mvList.length > 1) {
		  position.undoMakeMove();
		  fen_list_new.pop();
		  //data.moves = data.moves.substr(0, (data.moves.length-4));
		}
		//this.setData({
			data.selected = false;
			data.selected_src = 0;
			data.position = position;
			data.fen_list_new = fen_list_new;
			data.dsts = [];
			data.is_mate = false;
		//})  

		clearChessBoard();
		fenDrawing(data.context_cb, data);		
	}else{
       let userInfo = getUserInfo();
	   let currentUid = userInfo.id || "";
       let opUid = obj.user &&  obj.user.id || "";
	   
	   console.log("currentUid", currentUid);
	   //当前用户是游戏者，
	   let isPlayer = true;
	   if(currentUid !== opUid  && isPlayer ===true ){
		   alert("对手拒绝了你的悔棋请求！");
	   }
	}


    //TODO ，切换显示棋盘，开始按钮
} 

//认输
function  opResignCallback(obj){
	let tableId = obj.tableId || null;
	if(tableId === null){
		 return;
	}
	
    //data.gameTable.state = 2;
	//data.state = 2;
	let opPlayerName = obj.user &&  obj.user.name ||  "";
	
	if(opPlayerName === ""){
		return;
	}
	
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";
   
   console.log("currentUid", currentUid);
   //当前用户是游戏者，
   let isPlayer = true;
   if(currentUid !== opUid  && isPlayer ===true ){
	   alert(opPlayerName + "认输了！");
   }
   endGame();   
	
	 
	// ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
}
//协商和棋回调
function opDrawCallback(obj){
	$('#drawModal').modal("show");
}

//和棋响应处理
function  opDrawResponseCallback(obj){
	let tableId = obj.tableId || null;
	if(tableId === null){
		 return;
	}
	let responseData = obj.data || "";
	if(responseData === "agree"){
		  // 如果走法数组不为空，那么就撤销一步棋
         endGame();
		
        alert("双方协商和棋");		
	}else{
       let userInfo = getUserInfo();
	   let currentUid = userInfo.id || "";
       let opUid = obj.user &&  obj.user.id || "";
	   
	   console.log("currentUid", currentUid);
	   //当前用户是游戏者，
	   let isPlayer = true;
	   if(currentUid !== opUid  && isPlayer ===true ){
		   alert("对手拒绝了你的和棋请求！");
	   }
	}


    //TODO ，切换显示棋盘，开始按钮
}

//强退
function  opQuitCallback(obj){
	let tableId = obj.tableId || null;
	if(tableId === null){
		 return;
	}
	
    //data.gameTable.state = 2;
	//data.state = 2;
	let opPlayerName = obj.user &&  obj.user.name ||  "";
	
	if(opPlayerName === ""){
		return;
	}
	
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";
   
   console.log("currentUid", currentUid);
   //当前用户是游戏者，
   let isPlayer = true;
   if(currentUid !== opUid  && isPlayer ===true ){
       endGame();
		
	   alert(opPlayerName + "强退了！");
   }else if(currentUid === opUid ){
	  endGame(); 
	  returnHome(); 
   }
 /*  
   let tables = data.tables || [];
   let index = tableId -1;
   let table = tables[index] || null;
   
   if(table === null){
	 return;  
   }
   let players = table.players || [];
   let playersNew = [];
	for(let i = 0; i < players.length; i++){
		let player = players[i];
		if(player.id === opUid){
			//players[i] = {};
		}else{
			playersNew.push(player);
		}
	} 
    table.players = playersNew;
	*/
	/*
   let tables = data.tables || [];
   let index = tableId -1;
   let table = tables[index] || null;
   
   if(table === null){
	 return;  
   }
   
   let serverGameTable = obj.gameTable || null;
   
   if(serverGameTable === null){
	   return;
   }
   
   table = serverGameTable;
   
	let tr_ele = document.querySelector('#game-table-' + table.id);
    tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
					 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
					 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
					 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
    ; 
*/
   updateGameTable(obj);	
   
}

//离开回调
function  opLeaveCallback(obj){
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";	
   
   updateGameTable(obj);
   
   if(currentUid !== opUid){
	   //将用户从游戏列表中删除
	   let players = data.gameTable && data.gameTable.players || [];
	   let playersNew = [];
	   players.forEach(function each(player, index) {
		  let playerId = player.id || "";
		  //对弈者自己
		  if(playerId !== opUid){
			playersNew.push(player);  
		  }
		});
       data.gameTable.players = playersNew;
	   //更新游戏者信息
	   showPlayers();
	   //显示一个消息
	   return;
   }
   //如果id相等，表示加入成功
   if(currentUid === opUid){	
	returnHome();
   }
}
 
  //加入回调
function  opJoinCallback(obj){
	
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUser = obj.user || {};
   let opUid = opUser.id || "";	
   //用户id为空，数据不正常，
   if(opUid ===""){
	   return;
   }
   
   //更新游戏桌子信息
   updateGameTable(obj);
   
   if(currentUid !== opUid){
	   //将用户加入到players数组
	   let players = data.gameTable && data.gameTable.players || [];
	   //gameTable初始化
	   if(players.length === 0){
		  data.gameTable = {}; 
	   }
	   players.push(opUser);
	   data.gameTable.players = players;
	   
	     showPlayers();
	   //显示一个消息
	   return;
   }
   //如果id相等，表示加入成功
   if(currentUid === opUid){
		console.log("obj", obj);
		console.log("obj", obj.gameTable);
		console.log("切换显示棋盘，开始按钮");
		const tablesWrapper = document.querySelector('#tables-wrapper');
		const chessWrapper = document.querySelector('#chess-wrapper');
		tablesWrapper.classList.add("hidden");
		chessWrapper.classList.remove("hidden");
		
		data.tableId = obj.tableId || null;
		data.gameTable = obj.gameTable || null;
		showPlayers();
		
		//存储当前table到localStorage，防止用户关闭浏览器，
		localStorage.setItem("activeTable",JSON.stringify(data.gameTable));
		
		initChess();
		
		//可以配置游戏设置
		let canEdit = canEditSettings();
		if(canEdit){
          changeSettingEditable();
		}
		
		//同步游戏设置
		let settings = obj.gameTable && obj.gameTable.settings || {};
		syncSettingValues(settings);
		
		//显示旁观者
		showOnlookers();
   }
	
    //TODO ，切换显示棋盘，开始按钮
	
	
} 

//旁观回调
function  opLookonCallback(obj){
	
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUser = obj.user || {};
   let opUid = opUser.id || "";	
   //用户id为空，数据不正常，
   if(opUid ===""){
	   return;
   }
   
   
   if(currentUid !== opUid){
	    // showOnlookers();
	   //显示一个消息
	   return;
   }
   //如果id相等，表示加入成功
   if(currentUid === opUid){
		console.log("obj", obj);
		console.log("obj", obj.gameTable);
		console.log("切换显示棋盘，开始按钮");
		const tablesWrapper = document.querySelector('#tables-wrapper');
		const chessWrapper = document.querySelector('#chess-wrapper');
		tablesWrapper.classList.add("hidden");
		chessWrapper.classList.remove("hidden");
		
	   //控制按钮的显示	
		const buttonRowShow = document.querySelector('.button-row.show');
		const buttonRowToShow = document.querySelector('.button-row.onlooker');
		buttonRowShow.classList.remove("show");
		buttonRowToShow.classList.add("show");			
		
		data.tableId = obj.tableId || null;
		data.gameTable = obj.gameTable || null;
		//当前用户为旁观者
		data.isOnlooker = true; 
		
		showPlayers();
		
		//存储当前table到localStorage，防止用户关闭浏览器，
		localStorage.setItem("activeTable",JSON.stringify(data.gameTable));
		
		initChess();
		
		//同步游戏设置
		let settings = obj.gameTable && obj.gameTable.settings || {};
		syncSettingValues(settings);
		
		//显示旁观者
		showOnlookers();
		
   }
	
    //TODO ，切换显示棋盘，开始按钮
	
	
} 

//旁观者离开回调
function  opOnlookerLeaveCallback(obj){
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";	
   console.log("opOnlookerLeaveCallback",obj);
   //updateGameTable(obj);
   
   if(currentUid !== opUid){

	   data.gameTable = obj.gameTable || null;
	   //更新游戏者信息
	   showOnlookers();
	   //显示一个消息
	   return;
   }
   //如果id相等，表示加入成功
   if(currentUid === opUid){	
      //清理工作，
	  returnHome();
   }
} 	

function  listInfoCallback(obj){
	let dataObj = obj.data || {};
	let tables = dataObj.tables || [];
	//保存到data里面
	data.tables = tables;
	
	console.log("tables", tables);
	tables.forEach(function each(table, index) {	
	   var tr_ele = document.createElement('tr');
	   
	   tr_ele.setAttribute("id", "game-table-" + table.id);
	   
	   //10分钟
	   if(index <10){
		  // let msg = obj.data || "";
		   tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
							 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
							 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
							 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
		   ;
		   document.querySelector('#table-list-body-default').appendChild(tr_ele);
	   }
	   //20分钟
	   else if(index <20){
		  // let msg = obj.data || "";
		   tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
							 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
							 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
							 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
		   ;
		   document.querySelector('#table-list-body-slow').appendChild(tr_ele);		   
	   }
	   //5分钟
	   else if(index <30){
		  // let msg = obj.data || "";
		   tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
							 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
							 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
							 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
		   ;
		   document.querySelector('#table-list-body-fast').appendChild(tr_ele);		   
	   }
	   //custom
	   else if(index <40){
		  // let msg = obj.data || "";
		   tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
							 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
							 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
							 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
		   ;
		   document.querySelector('#table-list-body-custom').appendChild(tr_ele);		   
	   }	   
	});	 
}

// *****************websocket 回调函数 结束 *********************/


// *****************用户界面操作 回调函数 开始 *********************/

function  readyAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}
     let msgObj = {
		type:'op_ready',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
} 

	

function  leaveAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_leave',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
}  


//悔棋
function  undoAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_undo',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
} 

//拒绝悔棋
function  refuseUndoAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_undo_response',  
		tableId:data.tableId || null, 
		data:"refuse", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));
    //document.querySelector('#undoModal').modal("hide");	 
	$('#undoModal').modal("hide");

}

//同意悔棋
function  agreeUndoAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_undo_response',  
		tableId:data.tableId || null, 
		data:"agree", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	

	//document.querySelector('#undoModal').modal("hide");	
	$('#undoModal').modal("hide");
}

//认输
function  resignAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_resign',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
}



 

//提和
function  drawAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_draw',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
}


//拒绝和棋
function  refuseDrawAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_draw_response',  
		tableId:data.tableId || null, 
		data:"refuse", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));
    //document.querySelector('#withdrawModal').modal("hide");	 
	$('#drawModal').modal("hide");

}

//同意和棋
function  agreeDrawAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_draw_response',  
		tableId:data.tableId || null, 
		data:"agree", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	

	//document.querySelector('#withdrawModal').modal("hide");	
	$('#drawModal').modal("hide");
}



//强退
function  quitAction(){
	let tableId = data.tableId || null;
	if(tableId === null){
		 returnHome();
	}

    let msgObj = {
		type:'op_quit',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
    //TODO ，切换显示棋盘，开始按钮
}

 
  
  //申请加入游戏
function  joinGameAction(id){
	console.log("id", id);
	
     let msgObj = {
		type:'op_join',  
		tableId:id, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	
}	


//旁观
function  lookonGameAction(id){
	console.log("id", id);
     let msgObj = {
		type:'op_lookon',  
		tableId:id, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));		
}

//旁观者离开
function  onlookerLeaveAction(){
	//console.log("id", id);
     let msgObj = {
		type:'op_onlooker_leave',  
		tableId:data.tableId || null, 
		data:"", 
	 };
	 
	 ws.send(JSON.stringify(msgObj));		
}

//翻转棋盘动作
function  reverseAction(){
//reverseAction()
  reverse();
}

//修改游戏设置参数
function  changeSettingsAction(){
	console.log("changeSettingsAction in");
  let time = document.querySelector('#game-setting-time').value;
  let stepTime = document.querySelector('#game-setting-step-time').value;
  let addTime = document.querySelector('#game-setting-add-time').value;
  
     let msgObj = {
		type:'op_settings',  
		tableId:data.tableId || null, 
		data:{
		  time:parseInt(time),
		  stepTime:parseInt(stepTime),
		  addTime:parseInt(addTime),
		}, 
	 };
	 
	 ws.send(JSON.stringify(msgObj));	  
}

// *****************用户界面操作 回调函数 结束 *********************/

//根据游戏桌的信息，显示对弈者
function  showPlayers(){
	let players = data.gameTable && data.gameTable.players || [];
	if(players.length === 0){
	  return;
	}
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";	
	players.forEach(function each(player, index) {
	  let playerId = player.id || "";
	  let playerName = player.name || "";
	  //对弈者自己
	  if(playerId === currentUid){
	      document.querySelector('#game-name-me').innerHTML = playerName;
	  }else{
	     document.querySelector('#game-name-opponent').innerHTML = playerName;
	  }
    });	
}

//显示游戏者时间
function  showPlayerTime(){
	let players = data.gameTable && data.gameTable.players || [];
	if(players.length === 0){
	  return;
	}
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let gameSettings = data.gameTable && data.gameTable.settings || {}
	players.forEach(function each(player, index) {
	  let playerId = player.id || "";
	  let playerName = player.name || "";
	  //对弈者自己
	  if(playerId === currentUid){
	      document.querySelector('#game-time-me').innerHTML = player.time || "600";
		  document.querySelector('#game-step-time-me').innerHTML = gameSettings.stepTime || "60";
	  }else{
	      document.querySelector('#game-time-opponent').innerHTML = player.time || "600";
		  document.querySelector('#game-step-time-opponent').innerHTML = gameSettings.stepTime || "60";
	  }
    });	  
}


//时长倒计时
function  countDownFn(){	
  let busy = data.busy || false;
  
  let gameSettings = data.gameTable && data.gameTable.settings || {} ;
  // 倒计时默认值  
  let countDownDefault = {
    time: gameSettings.time || 600,
	stepTime: gameSettings.stepTime || 600,
  }

  
  // 从data里面获取倒计时信息
  let countDown = data.countDown || countDownDefault;
  
  let time = countDown.time -1;
  let stepTime = countDown.stepTime -1;
  
  data.countDown = {
    time:time,
	stepTime:stepTime,
  };
  
  let date 
  //对方走棋
  if(busy === true){
 	      document.querySelector('#game-time-opponent').innerHTML = time ;
		  document.querySelector('#game-step-time-opponent').innerHTML = stepTime; 
  }
  //我方走棋
  else{
 	      document.querySelector('#game-time-me').innerHTML = time ;
		  document.querySelector('#game-step-time-me').innerHTML = stepTime;   
  }
}

function updateGameTable(obj) {
	let tableId = obj.tableId || null;
	if(tableId === null){
		 return;
	}	
	
   let tables = data.tables || [];
   let index = tableId -1;
   let table = tables[index] || null;
   
   if(table === null){
	 return;  
   }
   
   let serverGameTable = obj.gameTable || null;
   
   if(serverGameTable === null){
	   return;
   }
   
   table = serverGameTable;
   
	let tr_ele = document.querySelector('#game-table-' + table.id);
    tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
					 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
					 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
					 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
    ;  
}

//检查是否可以编辑
function  canEditSettings(){
	let ret = false;
	
	let type = data.gameTable && data.gameTable.type || "default";
	if(type !== "custom"){
	  return ret;	
	}
	
	let players = data.gameTable && data.gameTable.players || [];
	if(players.length === 0){
	  return ret;
	}
	
	let user = getUserInfo();
	let currentUid = user.id || "";
	
	let playerId = players[0] && players[0].id || "";
    //为空或者不等，

    if((currentUid === "") || (playerId ==="") || (currentUid !== playerId)){
	  return ret;
	}

	
    //如果游戏状态不在进行中
    let state =	data.gameTable && data.gameTable.state || 0;	
	if(state !== 1){
		ret = true;
	}
	
	return ret;
}

function  changeSettingEditable(){
  document.querySelector('#game-setting-time').disabled = false;
  document.querySelector('#game-setting-step-time').disabled = false;
  document.querySelector('#game-setting-add-time').disabled = false;
}

function  changeSettingDisabled(){
  document.querySelector('#game-setting-time').disabled = true;
  document.querySelector('#game-setting-step-time').disabled = true;
  document.querySelector('#game-setting-add-time').disabled = true;
}

function  syncSettingValues(settings){
    let time = settings.time || 600;
	let stepTime = settings.stepTime || 60;
	let addTime = settings.addTime || 10;
	
	var time_ele = document.getElementById("game-setting-time");
	var step_time_ele = document.getElementById("game-setting-step-time");
	var add_time_ele = document.getElementById("game-setting-add-time");
	time_ele.value = time;
	step_time_ele.value = stepTime;
	add_time_ele.value = addTime;

}

//显示旁观者列表
function  showOnlookers(){
	let onlookers = data.gameTable && data.gameTable.onlookers || [];
	
	let onlookers_list_html = "";
	
	if(onlookers.length === 0){
	  onlookers_list_html = "<p>暂无旁观者</p>"
	}
    
	
	
	onlookers.forEach(function each(onlooker, index) {
	  let onlookerId = onlooker.id || "";
	  let onlookerName = onlooker.name || "";
	  if(onlookerId !== "" && onlookerName !== ""){
	    onlookers_list_html += '<li id="onlooker-' + onlookerId + '">' + onlookerName + '</li>';
	  }

    });	
	
	document.querySelector('#onlookers-list').innerHTML = onlookers_list_html;
}

function initChess() {
	var init_fen = "";
	/*
    var init_fen = getParams("fen") || "";
	if(init_fen ==""){
		init_fen = window.localStorage.getItem('challenge_fen') || "";
		window.localStorage.removeItem('challenge_fen');
	}
	*/

	if(init_fen ==""){
		init_fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
	}
	//var moves = document.getElementById('qipu-moves-iccs').innerHTML || "";
	var moves = "";
	var fen_list = getFenList(init_fen, moves);
	var total_steps = Math.floor(moves.length / 4);
	data.total_steps = total_steps;
	data.fen_list = fen_list;
	data.moves = moves;
	data.challenge = true;


	var clientWidth = document.body.clientWidth ;
	var cellSize = 0;
	if(clientWidth > 768){
		cellSize = parseInt((document.querySelector("#chess-wrapper").clientWidth - 20) /9);
	}else{
		cellSize = parseInt((document.body.clientWidth - 30) /9);
	}
	//var cellSize = parseInt(( $("#qipu-wrapper").width() - 30) /9);

	if(cellSize > 50){
	  cellSize = 50;
	}

	var qipan_width = cellSize * 9 ;
	var qipan_height = cellSize * 10 ;


	data.cell_size = cellSize;
	data.qipan_width = qipan_width;
	data.qipan_height = qipan_height;

	


	canvas_cb.width = qipan_width;
	canvas_cb.height = qipan_height;
	

	context_cb.drawImage(canvas, 0, 0, qipan_width, qipan_height);

	fenDrawing(context_cb, data);


	var position = new Position();

	var current_step = data.current_step || 0
	var current_fen = fen_list[current_step] || 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w'	
	position.fromFen(current_fen);
	if(current_fen.indexOf(" b") != -1){
	  position.sdPlayer = 1;  
	}	
	data.position = position;	
}



//下面的博弈代码，


function convertXYtoInt(x,y) {
	var src = null;
	var use_red = data.use_red;
	if(use_red){
	  //src = (y+3) * 16 + (x +3);
      src = y * 16 + x + 51;	  
	}else{
	  //src = (9-y + 3) * 16 + (8-x +3);	
	  src = (12-y ) * 16 + (11-x);
	}
	
	return src;
} 

function convertIccsMovetoMv(iccs_move) {
  var x_array = new Array();
    x_array["a"] = 0;
    x_array["b"] = 1;
	x_array["c"] = 2;
	x_array["d"] = 3;
	x_array["e"] = 4;
	x_array["f"] = 5;
	x_array["g"] = 6;
	x_array["h"] = 7;
	x_array["i"] = 8;
	
  var from_x = iccs_move.charAt(0);
  var from_y = iccs_move.charAt(1);
  var from_x_index = x_array[from_x];
  
  var to_x = iccs_move.charAt(2);
  var to_y = iccs_move.charAt(3);
  var to_x_index = x_array[to_x];  
  //console.log('from_x_index', from_x_index);
  //console.log('from_y', from_y);

	var sqSrc = (9-from_y +3) * 16 + (from_x_index +3);
	//console.log('sqSrc', sqSrc);
	var sqDst = (9-to_y +3) * 16 + (to_x_index +3);
   // console.log('sqDst', sqDst);
	var mv = sqSrc + (sqDst << 8);
	
	return mv;
}
function  inArray(needle, haystack) {
     var length = haystack.length;
     for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
     }
     return false;
} 

/*
function getParams(key) {
    let search = window.location.search.replace(/^\?/, "");
    let pairs = search.split("&");
    let paramsMap = pairs.map(pair => {
        let [key, value] = pair.split("=");
        return [decodeURIComponent(key), decodeURIComponent(value)];
    }).reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
    return paramsMap[key] || "";
}
*/
function endGame() {
	
	//结束倒计时
	clearInterval(countDownInterval);
	
	
	//修改 游戏状态，游戏结束
	data.gameTable.state = 2;
	data.gameTable.moves = [];
	data.gameTable.ops = [];
	data.gameTable.turnNo = 1;
	data.gameTable.red = "";
	data.gameTable.black = "";		
		
	//重置相关状态
   var position = new Position();
    var init_fen = "";
	//var current_step = data.current_step || 0
	var current_fen = init_fen;	
	position.fromFen(current_fen);
	if(current_fen.indexOf(" b") != -1){
	  position.sdPlayer = 1;  
	}	
	data.position = position;
	data.moves = "";
	data.fen_list_new = [];
	data.is_mate = false;


	clearChessBoard();
	//context_cb.drawImage(canvas, 0, 0, data.qipan_width, data.qipan_height);

	fenDrawing(context_cb, data);		

   //控制按钮的显示	
	const buttonRowShow = document.querySelector('.button-row.show');
	const buttonRowToShow = document.querySelector('.button-row.state-2');
	buttonRowShow.classList.remove("show");
	buttonRowToShow.classList.add("show");	 
}
//bindtouchstart  
  //bindLongTapCallback: function (e) {
canvas_cb.addEventListener('click', function(e) {
	//如果游戏没有开始，则不能点击 
    let state = data.gameTable && data.gameTable.state || 0;
   // let turnNo = data.gameTable && data.gameTable.state || 1;	
	if(state !== 1){
		return;
	}
	
	if(data.busy == true){
		return;
	}

	
	//已经结束了
	if(data.is_mate == true){
		return;
	}	
	
    //console.log('canvasClickCallback', e)
	var challenge = data.challenge;
	if(!challenge){
		return;
	}
	
	//offsetX, offsetY,  clientX,clientY
	var x = e.offsetX || -1;
	var y = e.offsetY || -1;
	if(x == -1 || y == -1){
		return;
	}
    var cellSize = data.cell_size || 40;
	
	//console.log('cellSize', cellSize)
    var offset = parseInt(cellSize/2);	
	var x_1 = Math.round((x - offset) / cellSize);
	var y_1 = Math.round((y - offset) / cellSize);
	
	//console.log('x_1', x_1)
	//console.log('y_1', y_1)
	var src = convertXYtoInt(x_1, y_1);
	//console.log('src', src)
	
	//var xy = this.convertInttoXY(src);
	//console.log('xy', xy)
	var selected = data.selected;
	if(!selected){

		var position = data.position;
		var dsts = position.availableDsts(src);
		//console.log('dsts', dsts);
		//var newfen = position.toFen();
		//console.log('newfen', newfen);
		if(dsts.length > 0){
        //if(true){
			data.selected=true;
			data.selected_src=src;
			data.dsts=dsts;
			
          clearChessBoard();
	      fenDrawing(data.context_cb, data);
			//var context = wx.createCanvasContext('qipuCanvas')		
			//util.qipanDrawing(context,this.data)
			//util.fenDrawing(context, this.data)		
		}
	}else{
		var dsts = data.dsts;
		//console.log('zouzichenggong');
		if(inArray(src, dsts)){
		//if(true){	
			//console.log('zouzichenggong');
		   var sqDst = src;
		   var sqSrc = data.selected_src;
		   var mv = sqSrc + (sqDst << 8);
		   //console.log('mv', mv);
		   var position = data.position;
		   
		 //只有经过服务器确认后的 走棋 才能显示 ? ?,网络正常不会出事
		   position.makeMove(mv);
		   
		   /*
		   var newfen = position.toFen();
		   var fen_list_new = data.fen_list_new;
		   
		   fen_list_new.push(newfen);
		   //console.log('fen_list_new', fen_list_new);
            //set data
			data.selected=false;
			data.selected_src=0;
			data.position=position;
			data.fen_list_new=fen_list_new;
			data.dsts=[];
			
          clearChessBoard();
	      fenDrawing(data.context_cb, data);
*/
	  

          let moveIccs = position.move2Iccs(mv);
		 let msgObj = {
			type:'move',  
			tableId:data.tableId, 
			data:moveIccs, 
		 };
		 //清理倒计时
		 // clearInterval(countDownInterval);
		  
		  //将倒计时的信息连同走棋一起发送过去
		 msgObj.countDown = data.countDown || {};
		 
		 //如果绝杀了，增加状态isMate = 1;
		 if (position.isMate()) {
		    msgObj.isMate = 1;
		  }
		 
		 ws.send(JSON.stringify(msgObj));	
         
         //取消走的招法，等服务器返回后，再正式走棋		 
         position.undoMakeMove();		  
		  
		  //增加走子的
		  //var mv_iccs = position.move2Iccs(mv);
		  //data.moves =  data.moves + mv_iccs;
		   /*
		  if (position.isMate()) {	// 无棋可走，实际上就是被将死了
            endGame();
			
			var title = "红胜";
			if(newfen.indexOf(" b") == -1){
				title = "黑胜";  
			}

			data.is_mate=true;
			
			setTimeout(function(){ alert(title);}, 500);

           // alert(title);			

            return;			
		  }
		  */
		   
		   //fen_list_new
		   if(data.use_computer){
			   data.busy = true;
			   //setTimeout(computerPlay, 500);


		   }		  
		}else{
			var position = data.position;
			var available_dsts = position.availableDsts(src);
            if(available_dsts.length >0){
				//set data
				//this.setData({
				data.selected=true;
				data.selected_src=src;
				data.dsts=available_dsts;
				
			  clearChessBoard();
			  fenDrawing(data.context_cb, data);				
			
			}			
		}
		
	}
	
})
