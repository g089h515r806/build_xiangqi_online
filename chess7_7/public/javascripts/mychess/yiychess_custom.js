var clientWidth = document.body.clientWidth ;
var cellSize = 0;
if(clientWidth > 768){
	cellSize = parseInt((document.querySelector("#qipu-wrapper").clientWidth / 2 - 20) /9);
}else{
	cellSize = parseInt((document.body.clientWidth - 30) /9);
}
//var cellSize = parseInt(( $("#qipu-wrapper").width() - 30) /9);

if(cellSize > 50){
  cellSize = 50;
}

var qipan_width = cellSize * 9 ;
var qipan_height = cellSize * 10 ;
				
var init_fen = document.getElementById('qipu-init-fen').innerHTML || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
//var init_fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
var moves = document.getElementById('qipu-moves-iccs').innerHTML || "";
//var moves = "h2e2h9g7h0g2i9h9i0h0b9c7c3c4g6g5h0h6h7i7h6g6i7i8e3e4d9e8e4e5i8g8g6f6g5g4g3g4h9h3e5f5c9e7f5g5c6c5c4c5e7c5f6f8b7b8f8f7c7d5f7g7c5e7g7g6a9c9b0a2c9c2b2b1h3g3g6e6g3g2e6e5g8g4g0i2g4h4b1h1d5b4e5e4b4d3e4h4b8c8d0e1c8c0h4d4c0f0e1f0c2e2e0d0e2d2h1d1g2g1a2c3g1f1f0e1f1e1a0b0e8d9b0b9e7c9";
var fen_list = getFenList(init_fen, moves);
var total_steps = Math.floor(moves.length / 4);
data.total_steps = total_steps;
data.fen_list = fen_list;
data.moves = moves;
data.cell_size = cellSize;
data.qipan_width = qipan_width;
data.qipan_height = qipan_height;

var canvas_cb = document.getElementById('chessboard');
canvas_cb.width = qipan_width;
canvas_cb.height = qipan_height;
var context_cb = canvas_cb.getContext('2d');
context_cb.drawImage(canvas, 0, 0, qipan_width, qipan_height);

fenDrawing(context_cb, data);

setCurrentStepTxt();

jQuery.noConflict();
(function($) {
	$('#moves_text li span.move').click(function(event){	
	    event.preventDefault();
        $('#moves_text li span.move.active').removeClass('active');
		$(this).addClass('active');
		var current_step = $(this).attr('name');
		  data.current_step = current_step;
		  //console.log("current_step", data.current_step);
		  clearChessBoard();
		  fenDrawing(context_cb, data);
		  setCurrentStepTxt();		


    });
	
})(jQuery);	

