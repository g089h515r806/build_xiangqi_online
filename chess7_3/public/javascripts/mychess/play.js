var canvas_cb = document.getElementById('chessboard');
var context_cb = canvas_cb.getContext('2d');
data.canvas_cb = canvas_cb;
data.context_cb = context_cb;
 
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

  /*
  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }  
  */
  let ws;
  initWebsocket();
  //wsButton.onclick = function () {
function initWebsocket() {		
	 console.log("cookies", document.cookie);
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    //ws = new WebSocket(`ws://127.0.0.1:3000/echo`);
	ws = new WebSocket(`ws://localhost:3000/echo`);
    ws.onerror = function () {
      //showMessage('WebSocket error');
	  console.log('WebSocket error');
    };
    ws.onopen = function () {
      //showMessage('WebSocket connection established');
	  console.log('WebSocket connection established');
    };
	
    ws.onmessage = function (res) {
        let obj = JSON.parse(res.data);
		console.log("收到信息");
		console.log("obj", obj);
		let type = obj.type || "";
		
		switch(type) {
			case "chat": chatCallback(obj); break;
			case "move": moveCallback(obj); break;
			case "list_info": listInfoCallback(obj); break;
			case "op_join": opJoinCallback(obj); break;

			default : ;
		}
		/*
        if (obj.type === 'chat') {
			console.log("收到对手聊天信息");
			console.log("obj", obj);
			//msg
			 var msg_ele = document.createElement('li');
			 let msg = obj.data || "";
			 msg_ele.innerHTML =   '<span class="chat-owner">对手</span>'  + msg;
			 document.querySelector('#chat-list').appendChild(msg_ele);			
            //userNameSpan.innerHTML = obj.data;
        }else if(obj.type === 'move'){
			console.log("收到对手走子信息");
			console.log("obj", obj);
			opponentPlay(obj.data);
		}else if(obj.type === 'list_info'){
			let dataObj = obj.data || {};
			let tables = dataObj.tables || [];
			console.log("tables", tables);
			tables.forEach(function each(table) {	
			   var tr_ele = document.createElement('tr');
			  // let msg = obj.data || "";
			   tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
								 + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
								 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
								 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
			   ;
			   document.querySelector('#table-list-body').appendChild(tr_ele);
			});	

		}else if(obj.type === 'op_join'){
			//参加成功回调
			opJoinCallback(obj);
		}
		*/
	
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
	   tableId:1, 
	   data:msg, 
	};
	
	ws.send(JSON.stringify(msgObj));
	edit_message.value = '';
}; 

function  chatCallback(obj){
	//msg
	var msg_ele = document.createElement('li');
	let msg = obj.data || "";
	msg_ele.innerHTML =   '<span class="chat-owner">对手</span>'  + msg;
	document.querySelector('#chat-list').appendChild(msg_ele);	
	
} 

function moveCallback(obj){
   let userInfo = getUserInfo();
   let currentUid = userInfo.id || "";
   let opUid = obj.user &&  obj.user.id || "";	
   //如果是自己发出的，表示走法成功，无需再做操作， 也可以放到这里操作，todo

   if(currentUid === opUid){
	   //显示一个消息
	   return;
   }

	
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
   data.busy = false;	

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
	
	if(currentUid !== opUid){
		//将用户加入到players数组
		let players = data.gameTable && data.gameTable.players || [];
		//gameTable初始化
		if(players.length === 0){
		   data.gameTable = {}; 
		}
		players.push(opUser);
		data.gameTable.players = players;
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
		 
		 initChess();
	}
	 

 } 
/*
//改进前版本
function  opJoinCallback(obj){
	
	let opUser = obj.user || {};
	let opUid = opUser.id || "";	
	//用户id为空，数据不正常，
	if(opUid ===""){
		return;
	}

	//将用户加入到players数组
	let players = data.gameTable && data.gameTable.players || [];
	//gameTable初始化
	if(players.length === 0){
		data.gameTable = {}; 
	}
	players.push(opUser);
	data.gameTable.players = players;
	//显示一个消息
	return;
	 
 }
 */

 function  listInfoCallback(obj){
	let dataObj = obj.data || {};
	let tables = dataObj.tables || [];
	console.log("tables", tables);
	tables.forEach(function each(table) {	
	   var tr_ele = document.createElement('tr');
	  // let msg = obj.data || "";
	   tr_ele.innerHTML =   '<td class="table-id">' + table.id + '</td>'  + '<td class="table-player">' + (table.players && table.players[0] && table.players[0].name  || "无") + '</td>'
	                     + '<td class="table-player">' + (table.players && table.players[1] && table.players[1].name || "无") + '</td>'
						 + '<td class="join"><button onclick="joinGameAction(' + table.id + ')">' + ("参加") + '</button></td>'
						 + '<td class="lookon"><button onclick="lookonGameAction(' + table.id + ')">' + ("旁观") + '</button></td>'
	   ;
	   document.querySelector('#table-list-body').appendChild(tr_ele);
	});	 
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

/*	 
	 console.log("切换显示棋盘，开始按钮");
	 const tablesWrapper = document.querySelector('#tables-wrapper');
	 const chessWrapper = document.querySelector('#chess-wrapper');
	 tablesWrapper.classList.add("hidden");
	 chessWrapper.classList.remove("hidden");
	 
	 data.tableId = msgObj.tableId || null;

	 initChess();	
	 */ 
}	





function initChess() {
	var init_fen = getParams("fen") || "";
	//var init_fen = getParams("fen") || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
	if(init_fen ==""){
		init_fen = window.localStorage.getItem('challenge_fen') || "";
		window.localStorage.removeItem('challenge_fen');
	}

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

	var canvas_cb = document.getElementById('chessboard');

	canvas_cb.width = qipan_width;
	canvas_cb.height = qipan_height;
	var context_cb = canvas_cb.getContext('2d');

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

function  switchComputer() {
	if(data.busy == true){
		return;
	}
	if(data.is_mate == true){
		return;
	}	
	if(data.use_computer){
		 document.getElementById('switch_computer').innerHTML = '使用电脑';
	}else{
		 document.getElementById('switch_computer').innerHTML = '不用电脑';
	}
	data.use_computer = !data.use_computer;
   
}

function resetChallenge() {
	if(data.busy == true){
		return;
	}	  

	var challenge = true;





   var position = new Position();
   // var init_fen = getParams("fen") || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
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


  }
  
function  withdraw() {
	if(data.busy == true){
		return;
	}	  
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
	fenDrawing(context_cb, data);

} 
/*
function opponentPlay(mv){
   
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
   data.busy = false;	

  //增加走子的
  //var mv_iccs = position.move2Iccs(mv_bst);
  //data.moves =  data.moves + mv_iccs;   
   
  clearChessBoard();
  fenDrawing(context_cb, data);	
  


   if (position.isMate()) {	
       data.is_mate = true;
		var title = "红胜";
		if(newfen.indexOf(" b") == -1){
			title = "黑胜";  
		}		   
       setTimeout(function(){ alert(title);}, 500);
		
		return;						
	}	
}
*/ 
/*  
function computerPlay(){
   
   var position = data.position;
   var search = new Search(position, 16);
   var mv_bst = search.searchMain(16,4000);	 
   //console.log("mv_bst", mv_bst);	
    
	position.makeMove(mv_bst);	
   var newfen = position.toFen();
   var fen_list_new = data.fen_list_new;
   //console.log('fen_list_new0', fen_list_new);
   fen_list_new.push(newfen);
   data.busy = false;	

  //增加走子的
  //var mv_iccs = position.move2Iccs(mv_bst);
  //data.moves =  data.moves + mv_iccs;   
   
  clearChessBoard();
  fenDrawing(context_cb, data);	
  


   if (position.isMate()) {	
       data.is_mate = true;
		var title = "红胜";
		if(newfen.indexOf(" b") == -1){
			title = "黑胜";  
		}		   
       setTimeout(function(){ alert(title);}, 500);
		
		return;						
	}	
} 
*/

function getParams(key) {
    let search = window.location.search.replace(/^\?/, "");
    let pairs = search.split("&");
    let paramsMap = pairs.map(pair => {
        let [key, value] = pair.split("=");
        return [decodeURIComponent(key), decodeURIComponent(value)];
    }).reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
    return paramsMap[key] || "";
}

//bindtouchstart  
  //bindLongTapCallback: function (e) {
canvas_cb.addEventListener('click', function(e) {
	//电脑思考中  

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
	      fenDrawing(context_cb, data);
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
		   /*  可以将下面的代码注释掉，放到movecallback回调里面 */
		   //console.log('mv', mv);
		   var position = data.position;
		   position.makeMove(mv);
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
	      fenDrawing(context_cb, data);	
		

          let moveIccs = position.move2Iccs(mv);
		 let msgObj = {
			type:'move',  
			tableId:1, 
			data:moveIccs, 
		 };
		 
		 ws.send(JSON.stringify(msgObj));		  
		  
		  //增加走子的
		  //var mv_iccs = position.move2Iccs(mv);
		  //data.moves =  data.moves + mv_iccs;
		 /*  可以将下面的代码注释掉，放到movecallback回调里面 */
		  if (position.isMate()) {	// 无棋可走，实际上就是被将死了

			var title = "红胜";
			if(newfen.indexOf(" b") == -1){
				title = "黑胜";  
			}

			data.is_mate=true;
			
			setTimeout(function(){ alert(title);}, 500);

           // alert(title);			

            return;			
		  }
		   
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
			  fenDrawing(context_cb, data);				
			
			}			
		}
		
	}
	
})






  
