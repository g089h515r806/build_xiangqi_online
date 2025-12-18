import ejs from 'ejs';
import { rootDir } from '../../config.js';
import {User} from '../user/user.model.js';
import UserService from '../user/user.service.js';
//import DblogService from '../dblog/dblog.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { jwtSecret } from '../../config.js';



class FrontController {
	
  /**
   * user login for GET
   * @param {req, res, next} Express param
   */
  async matches(req, res) {
	  console.log('Cookies: ', req.cookies);
	  
	  console.log('Signed Cookies: ', req.signedCookies)
	  let user = req.auth || {};
	   console.log('user1:', user)
	   let user2 = res.locals.user || {};
	    console.log('user2:', user2)
	  
    //check system has a user.
	let mainContent = await ejs.renderFile(`${rootDir}/views/main/matches.ejs`, {});
	
	let scripts = '<script src="/javascripts/mychess/book.js"></script>';
	
	scripts = scripts + '<script src="/javascripts/mychess/position.js"></script>';
	scripts = scripts + '<script src="/javascripts/mychess/search.js"></script>';
	scripts = scripts + '<script src="/javascripts/mychess/yiychess.js"></script>';
	scripts = scripts + '<script src="/javascripts/mychess/play.js"></script>';

	scripts = scripts + '<script src="/javascripts/matches.js"></script>';
	//console.log("main_content", mainContent);
	
	//
     res.render('page', { title: '正在进行的比赛', main_content: mainContent, stylesheets: '', scripts: scripts,});
  }

  /**
   * user login for GET
   * @param {req, res, next} Express param
   */
  async match(req, res) {
	  console.log("cookies", req.cookies);
	   console.log("session", req.session);
	   
    //check system has a user.
	let mainContent = await ejs.renderFile(`${rootDir}/views/main/match.ejs`, {});
	//console.log("main_content", mainContent);
     res.render('page', { title: '在线下棋', main_content: mainContent, stylesheets: '', scripts: '',});
  }

  /**
   * user login for GET
   * @param {req, res, next} Express param
   */
  async robots(req, res) {
    //check system has a user.
	let mainContent = await ejs.renderFile(`${rootDir}/views/main/robots.ejs`, {});
	//console.log("main_content", mainContent);
     res.render('page', { title: '人机对战', main_content: mainContent, stylesheets: '', scripts: '',});
  }  

  /**
   * user login for GET
   * @param {req, res, next} Express param
   */
  async userLoginGet(req, res) {
    //check system has a user.
	let mainContent = await ejs.renderFile(`${rootDir}/views/main/userlogin.ejs`, {});
	//console.log("main_content", mainContent);
     res.render('page', { title: '用户登录', main_content: mainContent, stylesheets: '', scripts: '',});
  }

  /**
   * user login for POST
   * @param {req, res, next} Express param
   */
  async userLoginPost(req, res) {
    //check system has a user.
     const { name, pass  } = req.body;
	 //console.log("body", req.body);
	 // console.log("name", name);
	  //console.log("pass", pass);
    try {
      //const user = await new User({name:'Test1 name',email:'test',realname:'张三'}).save();
	  // console.log(req.body);
	 // ctx.body ={message:'123456'};	
     //错误消息
     let message = "";	 

	  const user = await User.findOne({ name: req.body.name});
	  
	  //console.log(ctx.params);
      if (!user) {
		 message ='无效的用户名';
	    //res.json({
		//   message:'无效的用户名',
		//   error: true
	    //});		  
        res.redirect('/user/login');
		return;
      }
      var pswdHash = user.password || '';
      if (pswdHash == '') {
		message ='无效的密码';
	    res.redirect('/user/login');		  

		return;
      }	  
      var valid = bcrypt.compareSync(req.body.pass, pswdHash);
	  
	  if(!valid){
		message ='无效的密码';
	    res.redirect('/user/login');		  

		return;
	  }
	  let token = jwt.sign(
			{
			  id: user._id,
			  name: user.name
			},
			jwtSecret,
            { expiresIn: 14400 }
			//{ expiresIn: 120 }
		  );
        res.cookie('token',token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: false })
		//req.session.userId = user._id;
		
        res.redirect('/matches');
	 
    } catch (err) {
	  console.log(err);
      //ctx.throw(422);
	  res.status(422).end();   
    }	  
	  
	 //res.redirect('/matches');
  }
  
  /**
   * user register for GET
   * @param {req, res, next} Express param
   */
  async userRegisterGet(req, res) {
    //check system has a user.
	let mainContent = await ejs.renderFile(`${rootDir}/views/main/userregister.ejs`, {});
	//console.log("main_content", mainContent);
     res.render('page', { title: '用户登录', main_content: mainContent, stylesheets: '', scripts: '',});
  }

  /**
   * user register for POST
   * @param {req, res, next} Express param
   */
  async userRegisterPost(req, res) {
    //check system has a user.
     const { name, pass  } = req.body;
	 
    try {
	  var userSource = new User();
	  let userObj = req.body;
	  let name = userObj.name || "";
	  var exist_name = await User.findOne({ name: name});
	  let email = userObj.email || "";
	  var exist_email = await User.findOne({ email: email});	  
	  //var errors = userSource.validateSync();
	  let errorMsg = "";
	  if(exist_name){
		errorMsg =  errorMsg + "用户名已存在;";
	  }
	  if(exist_email){
		errorMsg =  errorMsg + "电子邮件地址已存在;";
	  }
      // console.log('123123');
      //set default role		  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['authenticated']; 
	  }

	  if(errorMsg != ""){
		  res.redirect('/user/register');
		//res.json({error:true, message:errorMsg});  
		//ctx.body = {error:true, message:errorMsg};  
	  }else{
        const user = await new User(userObj).save();
        //ctx.body = user;
		//res.json(user);
		  res.redirect('/user/login');
	  }
    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end(); 
	  
    }	 
	 
	 //console.log("body", req.body);
	 // console.log("name", name);
	  //console.log("pass", pass);
	 //res.redirect('/matches');
  }  

}

export default new FrontController();
