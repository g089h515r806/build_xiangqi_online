//import Todo from './todo.model';
import child_process from 'child_process';
import axios from 'axios';
import { chessEnginePath } from '../../config.js';



class EngineController {

  /**
   * Get best Move
   * @param {req, res, next} Express param
   */
  async getBestMove(req, res, next) {
	try {
		console.log("query", req.query)
		let fen = req.query.fen || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";
		let move = "";
		
		  //可以注释掉，这样就可以测试引擎是否起作用
		
		const  dataURL = 'http://www.chessdb.cn/chessdb.php?action=querybest&board=' + fen;
		//设置超时时间
		axios.defaults.timeout = 3000;
		let ret = await axios.get(dataURL);
		//console.log("ret", ret);
		
		//move:b0a2
		//nobestmove
		let retValue = ret.data || "";
		let first = retValue.substr(0,5);
		move = retValue.substr(5,4);
		//有效招法：
		if(first ==="move:"){
			  res.json({
				move:move,
			  });
            return;			  
		}
		
		
		
		
		//如果没有返回招法,我们这里使用佳佳象棋引擎，计算最佳招法，这里做了限制，默认16层，时间1秒中，
		//w我被佳佳象棋16层惊呆了， ELEEYE.exe
		/*
	  let enginePath = "D:\\nodejs\\chess\\chess_engine\\ElephantEye\\BIN";	

		  //let input = "position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w\ngo depth 16 movetime 1000\n";
		  let input = "position fen " + fen + "\ngo depth 20 movetime 5000\n";
		  //execSync
		  let  stdout = child_process.execSync('NewGG.exe', {cwd: chessEnginePath, input: input});
		  //let  stdout = child_process.execSync('ELEEYE.exe', {cwd: enginePath, input: input});
		  

		  //bestmove b2b9
		  let ret_str =  stdout.toString() || "";
		  
		  console.log("enginout", ret_str);
		  
		  let i = ret_str.indexOf("bestmove");

		  if(i > 0){
			  //bestmove 8个字符，加一个空格
			 move =  ret_str.substr(i+9, 4);
		  }	
		  */
		  
	 let engine_pro = child_process.spawn('NewGG.exe', {cwd: chessEnginePath});
	 
	 //let engine_pro = child_process.spawn('ELEEYE.exe', {cwd: enginePath});
	 //let engine_pro = child_process.spawn('cyclone.exe', {cwd: enginePath});
	 
		engine_pro.stdout.on('data', (data) => {
		  
		  let data_str = data.toString();
		  let i = data_str.indexOf("bestmove");
		  let move = "";
		  if(i > 0){
			  //bestmove 8个字符，加一个空格
			 move =  data_str.substr(i+9, 4);
		  }	
          if(move !==""){
			  console.log(`stdout: ${data}`);
			  res.json({
				move:move,
			  });
            return;				  
		  }		  

		});

		engine_pro.stderr.on('data', (data) => {
		  console.error(`stderr: ${data}`);
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });		  
		});

		engine_pro.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });			  
		});	

      engine_pro.stdin.write("position fen " + fen + "\n");	
      //engine_pro.stdin.write("go ponder depth 16 movetime 1000" + "\n");	
      //engine_pro.stdin.write("go ponder depth 16 movetime 1000" + "\n");
      engine_pro.stdin.write("go depth 16 movetime 1000" + "\n");	  
	  
/*	  
	//这种方式旋风可以工作，但是其它引擎不行。	  
     let enginePath = "D:\\nodejs\\chess\\chess_engine\\cyclone\\";
     let input = "position fen " + fen + "\ngo ponder depth 16 movetime 1000\n";
	  
	  let  stdout = child_process.execSync('cyclone.exe', {cwd: enginePath, input: input});

	  //bestmove b2b9
	  let ret_str =  stdout.toString() || "";
        console.log("enginout", ret_str);
	  
	  let i = ret_str.lastIndexOf("pv ");
	 // let move = "";
	  if(i > 0){
		  //bestmove 8个字符，加一个空格
		 move =  ret_str.substr(i+3, 4);
	  }	  
	  		  
        //如果获得有效招法，返回		  
		if(move !==""){
			  res.json({
				move:move,
			  });
            return;			  
		}		
		//var n=str.substr(2,3)
		
		*/
		
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
		  /*
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });	*/	  
	  } catch (error) {
		console.log("error", error)
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });
	  }	  
	  
  }
  

  /**
   * test Engine
   * @param {req, res, next} Express param
   */
  async testEngine(req, res, next) {
	  console.log("testEngine");
	try {
		
		//let enginePath = "D:\\nodejs\\chess\\chess_engine\\gg\\NewGG.exe";
	  let enginePath = "D:\\nodejs\\chess\\chess_engine\\gg\\";	
	  //let enginePath = "D:\\nodejs\\chess\\chess_engine\\cyclone\\";
      //let enginePath = "D:\\nodejs\\chess\\chess_engine\\ElephantEye\\BIN";		 


	  
	  
	  // windows  \r\n, linux \n, 我测试的\n在windows下面也可以的
	  //let input = "uci\r\nposition fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w\r\ngo depth 16 movetime 1000\r\n";
	 // let input = "position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w\r\ngo depth 16 movetime 1000\r\n";
	  //let input = "position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w\ngo depth 16 movetime 1000\n";
	 // let input = "position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C2C4/9/RNBAKABNR b\ngo depth 16 movetime 1000\n";
	   let input = "position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C2C4/9/RNBAKABNR b\ngo ponder depth 16 movetime 1000\n";
	  // let input = "ucci\n";
	  
	  
	  //spawn
	 let engine_pro = child_process.spawn('NewGG.exe', {cwd: enginePath});
	 
	 //let engine_pro = child_process.spawn('ELEEYE.exe', {cwd: enginePath});
	 //let engine_pro = child_process.spawn('cyclone.exe', {cwd: enginePath});
	 
		engine_pro.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		  let data_str = data.toString();
		  let i = data_str.indexOf("bestmove");
		  let move = "";
		  if(i > 0){
			  //bestmove 8个字符，加一个空格
			 move =  data_str.substr(i+9, 4);
		  }	
          if(move !==""){
			  res.json({
				move:move,
			  });
            return;				  
		  }		  

		});

		engine_pro.stderr.on('data', (data) => {
		  console.error(`stderr: ${data}`);
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });		  
		});

		engine_pro.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });			  
		});	

      engine_pro.stdin.write("position fen rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C2C4/9/RNBAKABNR b" + "\n");	
      //engine_pro.stdin.write("go ponder depth 16 movetime 1000" + "\n");	
      //engine_pro.stdin.write("go ponder depth 16 movetime 1000" + "\n");
      engine_pro.stdin.write("go depth 16 movetime 1000" + "\n");	  
	  /*
	  
	  //execSync
	  //let  stdout = child_process.execSync('NewGG.exe', {cwd: enginePath, input: input});
	  let  stdout = child_process.execSync('cyclone.exe', {cwd: enginePath, input: input});
	   //let  stdout = child_process.execSync('ELEEYE.EXE', {cwd: enginePath, input: input});
	  //ELEEYE.exe
	  console.log("stdout", stdout);
	  console.log("stdout", stdout.toString());
	  //bestmove b2b9
	  let ret_str =  stdout.toString() || "";
	  */
	  /*
	  let i = ret_str.indexOf("bestmove");
	  let move = "";
	  if(i > 0){
		  //bestmove 8个字符，加一个空格
		 move =  ret_str.substr(i+9, 4);
	  }
	  */
	  /*
	  let i = ret_str.lastIndexOf("pv ");
	  let move = "";
	  if(i > 0){
		  //bestmove 8个字符，加一个空格
		 move =  ret_str.substr(i+3, 4);
	  }	  
	  
	  console.log("move", move);
	  */
	  
	  
	  /*
	  child_process.exec('NewGG.exe', {cwd: path},(error, stdout, stderr) => {
		  if (error) {
			console.error(`执行的错误: ${error}`);
			return;
		  }
		  console.log(`stdout: ${stdout}`);
		  console.error(`stderr: ${stderr}`);
      });
	  */
      // child_process.exec
		/*

		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });	
*/		  
	  } catch (error) {
		console.log("error", error)
		  res.json({
			error:"unknow",
			msg:"未知错误",
		  });
	  }	  
	  
  }

  /* eslint-enable no-param-reassign */
}



export default new EngineController();
