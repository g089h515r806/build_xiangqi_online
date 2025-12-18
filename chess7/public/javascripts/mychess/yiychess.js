console.log("亚艾元象棋棋谱播放器新版");
var data = {
    current_step: 0,
	total_steps: 0,
	fen_list: [],
	fen_list_new: [],
	moves:"",
    auto_play_text:'自动',
	auto_play:false,	
	cell_size: 40,
	qipan_width: 360,
	qipan_height: 400,
	use_red:true,
	challenge:false,
	selected:false,
	selected_src:0,
	dsts:[],
	position:null,
	use_computer:true,
	busy:false,
	is_mate:false,

};

//绘制棋盘,renderBoardBackground
//var canvas = document.getElementById('chessboard');
var canvas = document.getElementById('board_bg');
var context = canvas.getContext('2d');


qipanDrawing(context,50);
//fenDrawing(context, {cell_size:40});	
var piece_types = ["r","n","b","a","k","c","p"];
//红方棋子生成
for(var i= 0; i< 7; i++){
	var piece_type = piece_types[i];
	var canvas_piece = document.getElementById('r_' + piece_type);
   var context_piece = canvas_piece.getContext('2d');
   var piece_name =  convertMachineToReadName(piece_type.toUpperCase());
   qiziDrawing(context_piece, 25, 25, piece_name, true, 22);
}
//黑方棋子生成
for(var i= 0; i< 7; i++){
	var piece_type = piece_types[i];
	var canvas_piece = document.getElementById('b_' + piece_type);
   var context_piece = canvas_piece.getContext('2d');
   var piece_name =  convertMachineToReadName(piece_type);
   qiziDrawing(context_piece, 25, 25, piece_name, false, 22);
}


function qipanDrawing(context, cellSize) {
  //var cellSize = data.cell_size || 40;
  var cellSize = cellSize || 40;
  var offsetX = parseInt(cellSize/2);
  var offsetY = parseInt(cellSize/2);
  //console.log("cellSize", cellSize);	
	context.translate(offsetX, offsetY)
    context.strokeStyle = "brown";
    context.lineWidth = 2;

	for(var i= 1; i< 8; i++){

		lineDrawing(context,cellSize * i, 0, cellSize * i, cellSize * 4)
		lineDrawing(context,cellSize * i, cellSize * 5, cellSize * i, cellSize * 9)		
	}

	//棋盘行
	for(var i= 0; i<10; i++){
		lineDrawing(context,0, i * cellSize, cellSize * 8, i * cellSize)
	}
	
	lineDrawing(context,0, 0, 0, cellSize * 9)
	lineDrawing(context,cellSize * 8, 0, cellSize * 8 , cellSize * 9)

	lineDrawing(context, cellSize * 3 , 0, cellSize * 5, cellSize * 2)
	lineDrawing(context, cellSize * 5, 0, cellSize * 3, cellSize * 2)
	lineDrawing(context, cellSize * 3, cellSize * 9, cellSize * 5, cellSize * 7)
	lineDrawing(context, cellSize * 5, cellSize * 9, cellSize * 3, cellSize * 7)	
	
	var unit = 4;
	
    centerDrawing(context,cellSize * 1, cellSize * 2, unit, cellSize)
	centerDrawing(context,cellSize * 7, cellSize * 2, unit, cellSize)
	centerDrawing(context,cellSize * 0 , cellSize * 3, unit, cellSize)
	centerDrawing(context,cellSize * 2, cellSize * 3, unit, cellSize)
	centerDrawing(context,cellSize * 4 , cellSize * 3, unit, cellSize)
	centerDrawing(context,cellSize * 6 , cellSize * 3, unit, cellSize)
	centerDrawing(context,cellSize * 8, cellSize * 3, unit, cellSize)
	centerDrawing(context,cellSize * 0, cellSize * 6, unit, cellSize)
	centerDrawing(context,cellSize * 2, cellSize * 6, unit, cellSize)
	centerDrawing(context,cellSize * 4, cellSize * 6, unit, cellSize)
	centerDrawing(context,cellSize * 6, cellSize * 6, unit, cellSize)
	centerDrawing(context,cellSize * 8, cellSize * 6, unit, cellSize)	
    centerDrawing(context,cellSize * 1, cellSize * 7, unit, cellSize)
	centerDrawing(context,cellSize * 7, cellSize * 7, unit, cellSize)	
	
}

function lineDrawing(context, mx, my, lx, ly) {
	context.beginPath()
	context.moveTo(mx, my)
	context.lineTo(lx, ly)
	context.stroke()
}

function centerDrawing(context, x, y, unit, cellSize) {
	//中心点
	x =x;
	y = y;
	//左上
	if(x - unit > cellSize * 0.5){
	  lineDrawing(context, x - unit, y - 3 * unit, x - unit, y - unit);
	  lineDrawing(context, x - unit, y - unit, x - 3 * unit, y - unit);
    }
	//右上
	if(x + unit < cellSize * 8){
	lineDrawing(context, x + unit, y - 3 * unit, x + unit, y - unit);
	lineDrawing(context, x + unit, y - unit, x + 3 * unit, y - unit);
	}
	//左下
	if(x - unit > cellSize * 0.5){
	  lineDrawing(context, x - unit, y + 3 * unit, x - unit, y + unit);
	  lineDrawing(context, x - unit, y + unit, x - 3 * unit, y + unit);
	}
	//右下
	if(x + unit < cellSize * 8){
	lineDrawing(context, x + unit, y + 3 * unit, x + unit, y + unit);
	lineDrawing(context, x + unit, y + unit, x + 3 * unit, y + unit);
	}
}

function qiziDrawing(context, x, y, qizi_text, isred, radius) {
	context.lineWidth = 2;
	
	context.beginPath();
    //context.arc(x+1, y+1, 18, 0, 2 * Math.PI)
	context.arc(x, y, radius, 0, 2 * Math.PI)
	context.fillStyle = "rgba(250, 240, 240,1)";
    context.fill();
	var stroke_style = isred ? "red" : "#000000";
    context.strokeStyle = stroke_style;
    context.stroke()
    //context.stroke();
	context.fillStyle = stroke_style;
    context.textAlign = 'center';
	//context.font = (radius * 1.5)  + "px";
	//字体动态化
	context.font = "32px  Georgia";
    context.fillText(qizi_text, x, y  + parseInt(radius/2));		
}

function fenDrawing(context, data) {	
  var fen_list = data.fen_list || []
  var moves = data.moves || ""
  var current_step = data.current_step || 0
  var selected = data.selected
  var fen = fen_list[current_step] || ''
  var cellSize = data.cell_size || 40;
  var offsetX = parseInt(cellSize/2);
  var offsetY = parseInt(cellSize/2);
  var use_red = data.use_red
  //console.log(fen_list);
  // console.log("current_step",current_step);
  // console.log(fen);
  if(fen == ''){
    fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
  }
  
  var fen_list_new = data.fen_list_new || []
  var fen_list_new_length = fen_list_new.length;
  if(fen_list_new_length > 0){
	  fen = fen_list_new[fen_list_new_length-1];
  }
  
  var fen_array =new Array();
  var qiju = new Array();
  fen_array = fen.split("/"); 

  for (var i = 0; i < 10; i++) {
    var fen_item = fen_array[i] || '';
	var k = 0;
    if(fen_item == '' || fen_item == '9'){
	  continue;
    }else{
	  for(var j=0;j<fen_item.length; j++){
		if(k >8){
		   break;
		}  
		 var qizi_name = fen_item.charAt(j);
		if(/^\d+$/.test(qizi_name)){
		  k = parseInt(qizi_name) + k;
	  
		}else{
		  var qizi_text = convertMachineToReadName(qizi_name);
		  var isred = (qizi_name === qizi_name.toUpperCase());
          if(use_red){
			//qiziDrawing(context, cellSize * k, cellSize * i, qizi_text, isred, offsetX-2);
			if(isred){
			  var piece_img = document.getElementById("r_" + qizi_name.toLowerCase());
			  context.drawImage(piece_img, cellSize * k, cellSize * i, cellSize, cellSize);				
			}else{
			  var piece_img = document.getElementById("b_" + qizi_name);
			  context.drawImage(piece_img, cellSize * k, cellSize * i, cellSize, cellSize);
			 			
			}

		  }else{
            //qiziDrawing(context, cellSize * (8-k), cellSize * (9-i), qizi_text, isred, offsetX-2);
			if(isred){
			  var piece_img = document.getElementById("r_" + qizi_name.toLowerCase());
			  context.drawImage(piece_img, cellSize * (8-k), cellSize * (9-i), cellSize, cellSize);				
			}else{
			  var piece_img = document.getElementById("b_" + qizi_name);
			  context.drawImage(piece_img, cellSize * (8-k), cellSize * (9-i), cellSize, cellSize);					
			}		
		  }
		  k++;	
		}
		
		 
	  }		  
		
	}		
  }

  if(fen_list_new_length > 0){
	  
	  
	  if(data.position.mvList.length > 0 && !selected){

        var mv = data.position.mvList[data.position.mvList.length - 1]	
        moveDrawingChallenge(context, data, mv)

	  }	  
	  if(selected){
		console.log('selectedDrawing', selected);  
		selectedDrawing(context, data)  
	  }	  
  }else{
	  //播放模式
	  //console.log('播放模式');  
	  if(current_step > 0 && !selected){
		var move = moves.substring((current_step-1) * 4,current_step * 4); 
		console.log('moveDrawing');  
		moveDrawing(context, data, move)
	  }
	  if(selected){
		//console.log('selected', selected);  
		selectedDrawing(context, data)  
	  }
  }

  
  //context.draw()
}


function selectedDrawing(context, data, move) {
  var dsts = data.dsts || []
  var selected_src = data.selected_src
  var selected = data.selected	
  if(!selected){
	  return;
  }

  var src = convertInttoXY(selected_src, data);
  selectedfocusDrawing(context, data,src.x, src.y)
  
  //console.log("src", src);
  //console.log("dsts", dsts);
  //for
  for(var j=0;j<dsts.length; j++){
	var dst_obj = convertInttoXY(dsts[j], data);  
    selectedfocusDrawing(context, data,dst_obj.x, dst_obj.y)
  }
  
}
function convertInttoXY(i,data) {
	var xy = {};
	var use_red = data.use_red;
	if(use_red){
	var y = parseInt(i/16) -3;
    var x = i%16 - 3;
	
	xy.x = x;
	xy.y = y;
	}else{
		var y = 12-parseInt(i/16) ;
		var x = 11- i%16;
		
		xy.x = x;
		xy.y = y;		
		
	}
	return xy;
  
}
function moveDrawingChallenge(context, data, mv) {
  var src = mv & 255;		
  var dst =mv >> 8;
  var src_xy = convertInttoXY(src,data);
  var dst_xy = convertInttoXY(dst,data);
  movefocusDrawing(context, data, src_xy.x, src_xy.y)
  movefocusDrawing(context, data, dst_xy.x, dst_xy.y)
}
function moveDrawing(context, data, move) {
  var x_array = new Array();
    x_array["a"] = "0";
    x_array["b"] = "1";
	x_array["c"] = "2";
	x_array["d"] = "3";
	x_array["e"] = "4";
	x_array["f"] = "5";
	x_array["g"] = "6";
	x_array["h"] = "7";
	x_array["i"] = "8";
	
  var from_x = move.charAt(0);
  var from_y = move.charAt(1);
  var from_x_index = x_array[from_x];
  
  var to_x = move.charAt(2);
  var to_y = move.charAt(3);
  var to_x_index = x_array[to_x];
  
  var use_red = data.use_red  
  if(use_red){
    movefocusDrawing(context, data, from_x_index, 9-from_y)
    movefocusDrawing(context, data, to_x_index, 9-to_y)
  }else{
    movefocusDrawing(context, data, 8-from_x_index, from_y)
    movefocusDrawing(context, data, 8-to_x_index, to_y)	  
  }
  
}

function movefocusDrawing(context, data, x, y) {
	
  context.strokeStyle = "red";
  context.lineWidth = 1;
  var cellSize = data.cell_size || 40;
  var offsetX = parseInt(cellSize/2);
  var offsetY = parseInt(cellSize/2);
  x = x * cellSize + offsetX;
  y = y * cellSize + offsetY;
  
  context.beginPath()
  var radius = offsetX - 2

  context.moveTo(x-radius +5, y-radius)
  context.lineTo(x-radius , y-radius)
  context.lineTo(x-radius , y-radius + 5)
  
  context.moveTo(x+radius -5, y-radius)
  context.lineTo(x+radius , y-radius)
  context.lineTo(x+radius , y-radius + 5)

  context.moveTo(x-radius, y + radius -5)
  context.lineTo(x-radius , y + radius)
  context.lineTo(x-radius + 5 , y + radius)  
  
  context.moveTo(x + radius -5, y + radius)
  context.lineTo(x + radius , y + radius)
  context.lineTo(x + radius  , y + radius -5)  
  context.stroke()	
}

function selectedfocusDrawing(context, data, x, y) {
  var cellSize = data.cell_size || 40;
  var offsetX = parseInt(cellSize/2);
  var offsetY = parseInt(cellSize/2);
	
  //context.translate(offsetX, offsetY)	
  context.strokeStyle = "green";
  context.lineWidth = 1;

  //var offsetY = parseInt(cellSize/2);
  x = x * cellSize + offsetX;
  y = y * cellSize + offsetY;
  
  context.beginPath()
  var radius = offsetX - 2
  //console.log('offsetX',offsetX);
  context.moveTo(x-radius +5, y-radius)
  context.lineTo(x-radius , y-radius)
  context.lineTo(x-radius , y-radius + 5)
  
  context.moveTo(x+radius -5, y-radius)
  context.lineTo(x+radius , y-radius)
  context.lineTo(x+radius , y-radius + 5)

  context.moveTo(x-radius, y + radius -5)
  context.lineTo(x-radius , y + radius)
  context.lineTo(x-radius + 5 , y + radius)  
  
  context.moveTo(x + radius -5, y + radius)
  context.lineTo(x + radius , y + radius)
  context.lineTo(x + radius  , y + radius -5)  
	context.stroke()	
}

function dstDrawing(context, data, x, y) {
	
  context.strokeStyle = "green";
  context.lineWidth = 1;
  var cellSize = data.cell_size || 40;
  var offsetX = parseInt(cellSize/2);
  //var offsetY = parseInt(cellSize/2);
  x = x * cellSize;
  y = y * cellSize;
  
  context.beginPath()
  var radius = offsetX - 2

  context.moveTo(x-radius +5, y-radius)
  context.lineTo(x-radius , y-radius)
  context.lineTo(x-radius , y-radius + 5)
  
  context.moveTo(x+radius -5, y-radius)
  context.lineTo(x+radius , y-radius)
  context.lineTo(x+radius , y-radius + 5)

  context.moveTo(x-radius, y + radius -5)
  context.lineTo(x-radius , y + radius)
  context.lineTo(x-radius + 5 , y + radius)  
  
  context.moveTo(x + radius -5, y + radius)
  context.lineTo(x + radius , y + radius)
  context.lineTo(x + radius  , y + radius -5)  
	//context.stroke()	
}
function getFenList(fen, moves) {
  var fen_list = new Array();
  fen_list[0] = fen;
  var total_steps = Math.floor(moves.length / 4);
  var current_fen = fen;
  for(var i = 1; i<= total_steps ; i++){
	var move = moves.substring((i-1) * 4, i * 4); 
    fen_list[i] = nextFen(current_fen, move);
    current_fen = fen_list[i];		  
  } 
  return fen_list; 
}
function nextFen(fen, move) {
  var x_array = new Array();
    x_array["a"] = "0";
    x_array["b"] = "1";
	x_array["c"] = "2";
	x_array["d"] = "3";
	x_array["e"] = "4";
	x_array["f"] = "5";
	x_array["g"] = "6";
	x_array["h"] = "7";
	x_array["i"] = "8";	
	
  if(fen == ''){
    fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";

  }
  var fen_twoparts = fen.split(" ");
  var fen_first = fen_twoparts[0];
  var fen_second = fen_twoparts[1] || 'w';
  var fen_array =new Array();
  fen_array = fen_first.split("/"); 
  
  var from_x = move.charAt(0);
  var from_y = move.charAt(1);
  var from_fen_item = fen_array[9-from_y];
  var to_x = move.charAt(2);
  var to_y = move.charAt(3);
  var to_fen_item = fen_array[9-to_y];
  if(from_y == to_y){
	var from_row_array = fenItemToRowArray(from_fen_item);
	//todo
	var from_x_index = x_array[from_x];
	var qizi_name = from_row_array[from_x_index];
    from_row_array[from_x_index] = '';	
	//from_fen_item = rowArrayToFenItem(from_row_array);
	var to_x_index = x_array[to_x];
    from_row_array[to_x_index] = qizi_name;
	
	fen_array[9-from_y] = rowArrayToFenItem(from_row_array);
	  
  }else{
	var from_row_array = fenItemToRowArray(from_fen_item);
	//todo
	var from_x_index = x_array[from_x];
	var qizi_name = from_row_array[from_x_index];
    from_row_array[from_x_index] = '';	
	//from_fen_item = rowArrayToFenItem(from_row_array);
	fen_array[9-from_y] = rowArrayToFenItem(from_row_array);
	
	var to_row_array = fenItemToRowArray(to_fen_item);
	//todo
	var to_x_index = x_array[to_x];
    to_row_array[to_x_index] = qizi_name;	
	//from_fen_item = rowArrayToFenItem(from_row_array);
	fen_array[9-to_y] = rowArrayToFenItem(to_row_array);	
	  
  }
  
  fen_first = fen_array.join("/");
  if(fen_second == 'w'){
	fen_second = 'b';  
  }else{
	fen_second = 'w';  
  }
  var next_fen = fen_first + ' ' + fen_second;
  return next_fen;
  
  
}

function fenItemToRowArray(fen_item) {
  var row_array = new Array();
  var k = 0;  
  for(var j=0;j<fen_item.length; j++){
	if(k >8){
	  break;
	}
	var qizi_name = fen_item.charAt(j);
	if(/^\d+$/.test(qizi_name)){
		var g = 0;
		while(g < qizi_name){
			row_array[k] = '';
			k++;
			g++;
			if(k >8){
			  break;
			}			
		}
	}else{
		row_array[k] = qizi_name;
	    k++;		
	}
  }
  return row_array;
}

function rowArrayToFenItem(row_array) {
	var fen_item ="";
	var k = 0;
	for(var i = 0; i < row_array.length; i++){
		if(row_array[i] != ''){
		  if(k == 0){
			fen_item = fen_item + row_array[i];  
		  }else{
			fen_item = fen_item + k + row_array[i]; 
			k = 0;
		  }
		  
		}else{
		  k++;	
		}
	}
	if(k > 0){
	  fen_item = fen_item + k;	
	}
	return fen_item;
}


function convertMachineToReadName(m_name){
	switch(m_name)
	{
	case "r":
	  var name = "車";
	  break;
	case "n":
	  var name = "馬";
	  break;
	case "b":
	  var name = "象";
	  break;	  

	case "a":
	  var name = "士";
	  break;
	case "k":
	  var name = "将";
	  break;
	case "c":
	  var name = "砲";
	  break;
	case "p":
	  var name = "卒";
	  break;


	case "R":
	  var name = "俥";
	  break;
	case "N":
	  var name = "傌";
	  break;
	case "B":
	  var name = "相";
	  break;	  

	case "A":
	  var name = "仕";
	  break;
	case "K":
	  var name = "帅";
	  break;
	case "C":
	  var name = "炮";
	  break;
	case "P":
	  var name = "兵";
	  break;	  
	default:
	  var name = "";
	}

  return name;
}


function gotoEnd(e) {
    data.current_step = data.total_steps || "";
	
    clearChessBoard();
	fenDrawing(context_cb, data);
	setCurrentStepTxt();
}
function gotoInit(e) {
    data.current_step=0;
    clearChessBoard();
	fenDrawing(context_cb, data);
    setCurrentStepTxt();	
} 
function gotoNext(e) {
   //console.log("gotoNext");
	var next_step = data.current_step +1
	if(next_step <= data.total_steps){
	  data.current_step = next_step;
	  //console.log("current_step", data.current_step);
      clearChessBoard();
	  fenDrawing(context_cb, data);
	  setCurrentStepTxt();
	}

}
function gotoPrevious(e) {

	var previous_step = data.current_step - 1
	if(previous_step >= 0){

      data.current_step = previous_step;
      clearChessBoard();
	  fenDrawing(context_cb, data);
	  setCurrentStepTxt();
	}
}

function clearChessBoard() {
	var w = canvas_cb.width;
	var h = canvas_cb.height;
	//console.log("w", w);
	//console.log("h", h);
	//context_cb.clearRect(0,0,w,h);
	canvas_cb.width = w;
	canvas_cb.height = h;
	context_cb.drawImage(canvas, 0, 0, data.qipan_width, data.qipan_height);
}

function autoMove(e) {
   gotoNext();
	if(data.current_step == data.total_steps){
      clearInterval(this.interval);
        data.auto_play_text='自动';
		data.auto_play=false;
		document.getElementById('auto_play').innerHTML = '自动';
	  //自动播放结束，加入插屏广告
      //this.interstitialAd();
	}
}  
function autoPlay(e) {

	
    if(data.auto_play == false){
       data.auto_play_text='暂停';
	  data.auto_play=true;
	  document.getElementById('auto_play').innerHTML = '暂停';
      this.interval = setInterval(autoMove,2000);
    }else{
      clearInterval(interval);

        data.auto_play_text='自动';
		data.auto_play=false;
        document.getElementById('auto_play').innerHTML = '自动';

    }	  

}

function challenge(e){
  //使用跳转
  console.log("challenge");
  var current_step = data.current_step || 0
  var fen = fen_list[current_step] || '';
  window.localStorage.setItem('challenge_fen', fen);
  //var url = "https://www.xqipu.com/challenge?fen=" + fen;
  var url = "https://www.xqipu.com/challenge";
  window.open(url);
}

function reverse(e) {

	var use_red = !data.use_red;

    data.use_red = use_red;

      clearChessBoard();
	  fenDrawing(context_cb, data);
}

function setCurrentStepTxt(){
   var current_step_txt = data.current_step + '/' + data.total_steps;
   document.getElementById('current_step').innerHTML = current_step_txt;
   
   setActiveMove(data.current_step);
   //$("#qipu-wrapper #current-step").html(current_step_txt);		
}

function setActiveMove(step){
     document.querySelector('#moves_text li span.move.active').classList.remove('active');
     document.querySelector("#moves_text li span.move[name='"+ step +"']").classList.add('active');
	 var scroll_top = document.querySelector("#moves_text").scrollTop;
	 var total_height = document.querySelector("#moves_text").clientHeight -20;
	 var li_height = 20;
	 var current_position = Math.ceil(step/2);
	 var ret = current_position * 20 - total_height - scroll_top;
	 //console.log(ret);
	 if( ret > 0){ 
	 
	   var scroll_offset = scroll_top + Math.ceil(total_height/2);
	   document.querySelector("#moves_text").scrollTop(scroll_offset); 
	 }

}

var resizeTimer = null; 
//alert("宽度："+document.documentElement.clientWidth + " 高度："+document.documentElement.clientHeight); 
function doResize(){ 
	var clientWidth = document.body.clientWidth ;
	var cellSize = 0;
	if(clientWidth > 768){
		cellSize = parseInt((document.querySelector("#chess-wrapper").clientWidth / 2 - 20) /9);
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
  clearChessBoard();
  fenDrawing(context_cb, data);
  
    resizeTimer = null; 
}

window.onresize = function(){
    if( resizeTimer == null) {
        resizeTimer = setTimeout("doResize()",500);
    } 
}


