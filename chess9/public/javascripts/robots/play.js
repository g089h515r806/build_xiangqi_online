

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
//var cellSize = parseInt(( $("#chess-wrapper").width() - 30) /9);

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
		  
		  //增加走子的
		  //var mv_iccs = position.move2Iccs(mv);
		  //data.moves =  data.moves + mv_iccs;
		   
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
			   setTimeout(computerPlay, 500);


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


jQuery.noConflict();
(function($) {
    $("#qipu-challenge-form #edit-actions #edit-submit").click(function(e){
      
	  //获取最新的fen，moves，保存到隐藏域
	var  position = data.position;
	var mvlist= position.mvList || [];
	//if(mvlist.length < 3 ){

	var moves = "";
	for (var i = 1; i < mvlist.length; i ++) {
		var mv = mvlist[i];
		//var iccsmv = this.move2Iccs(mv);
		moves += position.move2Iccs(mv);
	}	  
	  

	  $("#edit-moves").val(moves);
	  $("#edit-fen").val(init_fen);
	  console.log("datamoves",moves );
	  console.log("init_fen", init_fen);
	  
	  //e.preventDefault();
	  //return false;
    });

})(jQuery);	
  
