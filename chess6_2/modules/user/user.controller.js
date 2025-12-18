import {User, Role} from './user.model.js';
import UserService from './user.service.js';
//import DblogService from '../dblog/dblog.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import aqp from 'api-query-params';
import { jwtSecret } from '../../config.js';

class UserController {
  /* eslint-disable no-param-reassign */

  /**
   * Find users
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {
	const query = req.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});
	
	console.log("filter", filter);

    const items =  await User.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){
	  const count = await User.find(filter).countDocuments().exec();	
	  res.json({
		items:items,
		count:count,
	  });

	}else{
	  res.json({
		items:items,
	  });
    }
  }
  

  /**
   * User login
   * @param {req, res, next} Express param
   */
  async login(req, res, next) {
	 console.log("req", req.body);  
    try {
      //const user = await new User({name:'Test1 name',email:'test',realname:'张三'}).save();
	  // console.log(req.body);
	 // ctx.body ={message:'123456'};	  

	  const user = await User.findOne({ name: req.body.name});
	  
	  //console.log(ctx.params);
      if (!user) {
	    res.json({
		   message:'Invalid username',
		   error: true
	    });		  

		return;
      }
      var pswdHash = user.password || '';
      if (pswdHash == '') {
	    res.json({
		   message:'Invalid password',
		   error: true
	    });			  

		return;
      }	  
      var valid = bcrypt.compareSync(req.body.password, pswdHash);
	  
	  if(!valid){
	    res.json({
		   message:'Invalid password',
		   error: true
	    });		  

		return;	
	  }
	  res.json({
		  token: jwt.sign(
			{
			  id: user._id,
			  name: user.name,
			  email: user.email,
			  roles: user.roles,
			},
			jwtSecret,
            { expiresIn: 14400 }
			//{ expiresIn: 120 }
		  ),
		  message: 'success'
	  });	
	 

	 
    } catch (err) {
	  console.log(err);
      //ctx.throw(422);
	  res.status(422).end();   
    }
  }   

  /**
   * Find a user
   * @param {req, res, next} Express param
   */
  async findById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        //ctx.throw(404);
		res.status(404).end(); 
      }
	  res.json(user);
      //ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.throw(500);
	  res.status(500).end(); 
    }
  }

  /**
   * Add a user
   * @param {req, res, next} Express param
   */
  async add(req, res, next) {
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
		errorMsg =  errorMsg + "The username already exists;";
	  }
	  if(exist_email){
		errorMsg =  errorMsg + "The email already exists;";
	  }
       //console.log('123123');
      //set default role	  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['authenticated']; 
	  }

	  if(errorMsg != ""){
		res.json({error:true, message:errorMsg});  
		//ctx.body = {error:true, message:errorMsg};  
	  }else{
        const user = await new User(userObj).save();
        //ctx.body = user;
		res.json(user);
	  }
    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end(); 
    }
  }
  /**
   * Add a term
   * @param {req, res, next} Express param
   */
  async register(req, res, next) {
	  
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
		errorMsg =  errorMsg + "The username already exists;";
	  }
	  if(exist_email){
		errorMsg =  errorMsg + "The email already exists;";
	  }
      // console.log('123123');
      //set default role		  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['authenticated']; 
	  }

	  if(errorMsg != ""){
		res.json({error:true, message:errorMsg});  
		//ctx.body = {error:true, message:errorMsg};  
	  }else{
        const user = await new User(userObj).save();
        //ctx.body = user;
		res.json(user);
	  }
    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end(); 
	  
    }
  }
  
  /**
   * admin register, to be deleted
   * @param {req, res, next} Express param
   */
  async adminRegister(req, res, next) {
	  
    try {
	  var userSource = new User();
	  let userObj = req.body;
	  var exist_user = await User.findOne({});
      let errorMsg = "";
	  if(exist_user){
		errorMsg =  errorMsg + "The administrator already exists;";
		//ctx.body = {error:true, message:errorMsg};  
		res.json({error:true, message:errorMsg});  
        return;		
	  }
      console.log('userObj', userObj);
      // console.log('123123');
      //set default role	  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['administrator']; 
	  }

	  if(errorMsg != ""){
		//ctx.body = {error:true, message:errorMsg}; 
        res.json({error:true, message:errorMsg});  		
	  }else{
        const user = await new User(userObj).save();
        //ctx.body = user;
		res.json(user);
	  }
    } catch (err) {
		console.log("err",err);
      //ctx.throw(422);
	  res.status(422).end(); 
    }
  }  
  /**
   * Update a user
   * @param {req, res, next} Express param
   */
  async update(req, res, next) {
    try {
	  var opts = { runValidators: true };
	  //when password is empty, skip it.
	  let update = req.body;
	  let pw = update.password || "";
	  if(pw == ""){
		delete update.password;  
	  }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        update,
		opts
      );
      if (!user) {
        //ctx.throw(404);
		res.status(404).end(); 
      }
	  //await DblogService.watchdog("user", "更新了用户:" + user.name, 5, ctx);
      //ctx.body = user;
	  res.json(user);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end(); 
      }
	  
	  res.status(500).end(); 
	  //ctx.body =  err;
	  //console.log(err);
      //ctx.throw(500);
    }
  }

  /**
   * Delete a user
   * @param {req, res, next} Express param
   */
  async delete(req, res, next) {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      if (!user) {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.body = user;
	  res.json(user);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.throw(500);
	  res.status(500).end(); 
    }
  }
  /**
   * Find roles
   * @param {req, res, next} Express param
   */  
  async findRole(req, res, next) {
	//  console.log('123');
    const roles = await Role.find();
	res.json(roles);
  }
  /**
   * Find a role
   * @param {req, res, next} Express param
   */
  async findRoleById(req, res, next) {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.body = role;
	  res.json(role);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.throw(500);
	  res.status(500).end(); 
    }
  }

  /**
   * Add a role
   * @param {req, res, next} Express param
   */
  async addRole(req, res, next) {
    try {
      const role = await new Role(req.body).save();
      //ctx.body = role;
	  res.json(role);

    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end(); 
    }
  }

  /**
   * Update a role
   * @param {req, res, next} Express param
   */
  async updateRole(req, res, next) {
    try {
	  var opts = { runValidators: true };
      const role = await Role.findByIdAndUpdate(
        req.params.id,
        req.body,
		opts
      );
      if (!role) {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.body = role;
	  res.json(role);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end(); 
      }
	  res.status(500).end(); 
	  //ctx.body =  err;

    }
  }

  /**
   * Delete a role
   * @param {req, res, next} Express param
   */
  async deleteRole(req, res, next) {
    try {
      const role = await Role.findByIdAndRemove(req.params.id);
      if (!role) {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.body = role;
	  res.json(role);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end(); 
      }
      //ctx.throw(500);
	  res.status(500).end(); 
    }
  }  
  /**
   * Get all permissions
   * @param {req, res, next} Express param
   */
  async findAllPermissions(req, res, next) {
	//let perms = await UserService.getPermissions();
	ctx.body = await UserService.getPermissions();
  }
  
   
  /* eslint-enable no-param-reassign */
}

export default new UserController();
