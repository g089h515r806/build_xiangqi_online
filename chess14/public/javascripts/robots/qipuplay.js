var canvas_cb = document.getElementById('chessboard');
var context_cb = canvas_cb.getContext('2d');
data.canvas_cb = canvas_cb;
data.context_cb = context_cb;	 
initChess();

function initChess() {
    var init_fen = getParams("fen") || "";
	if(init_fen ==""){
		init_fen = window.localStorage.getItem('challenge_fen') || "";
		window.localStorage.removeItem('challenge_fen');
	}

	if(init_fen ==""){
		init_fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
	}
	var moves = document.getElementById('qipu-moves-iccs').innerHTML || "";
	//var moves = "";
	var fen_list = getFenList(init_fen, moves);
	var total_steps = Math.floor(moves.length / 4);
	data.total_steps = total_steps;
	data.fen_list = fen_list;
	data.moves = moves;
	data.challenge = false;


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



function getParams(key) {
    let search = window.location.search.replace(/^\?/, "");
    let pairs = search.split("&");
    let paramsMap = pairs.map(pair => {
        let [key, value] = pair.split("=");
        return [decodeURIComponent(key), decodeURIComponent(value)];
    }).reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
    return paramsMap[key] || "";
}



  
