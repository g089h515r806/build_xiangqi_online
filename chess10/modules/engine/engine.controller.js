//import Todo from './todo.model';
import axios from 'axios';

class EngineController {

  /**
   * Get best Move
   * @param {req, res, next} Express param
   */
  async getBestMove(req, res, next) {
	try {
		console.log("query", req.query)
		let fen = req.query.fen || "";
		const  dataURL = 'http://www.chessdb.cn/chessdb.php?action=querybest&board=' + fen;
		//设置超时时间
		axios.defaults.timeout = 3000;
		let ret = await axios.get(dataURL);
		//console.log("ret", ret);
		
		//move:b0a2
		//nobestmove
		let retValue = ret.data || "";
		let first = retValue.substr(0,5);
		let move = retValue.substr(5,4);
		//有效招法：
		if(first ==="move:"){
			  res.json({
				move:move,
			  });
            return;			  
		}
		
		//var n=str.substr(2,3)
		
		/*
		// 异步方式
		axios.get(dataURL)
		  .then(function (response) {
			  console.log("data",response.data);
			//var error = response.data.error || '';
			  res.json({
				move:"b0a2",
			  });
		  })
		  .catch(function (error) {
			 //console.log(error);
			   res.json({
				move:"b0a2",
			  });
		  });
		  */
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });		  
	  } catch (error) {
		//console.log("error", error)
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });
	  }	  
	  
  }
  



  /* eslint-enable no-param-reassign */
}



export default new EngineController();
