import {Vocabulary} from '../taxonomy/taxonomy.model.js';
import {User, Role} from '../user/user.model.js';

class SystemController {

  /**
   * check system installed
   * @param {req, res, next} Express param
   */
  async isInstalled(req, res, next) {
    //check system has a user.
	var exist_user = await User.findOne({});
	if(!exist_user){
		//ctx.body = {installed:false};
		res.json({installed:false});
	}else{
		//ctx.body = {installed:true};
		res.json({installed:true});
	}
  }

  /**
   * install system
   * @param {req, res, next} Express param
   */
  async install(req, res, next) {
	  
    try {


	  var exist_user = await User.findOne({});

	  if(exist_user){
        //ctx.throw(422);
		res.status(404).end();
        return;		
	  }
	  
	  //create category vocabulary
	  let category = {
		  code:'category',
		  name:'Category',
	  };
	  
	  await Vocabulary.findOneAndUpdate({ code: category.code}, category, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });
	  
	  let anonymous = {
		  rid:'anonymous',
		  name:'Anonymous user',
	  };
	  let authenticated = {
		  rid:'authenticated',
		  name:'Authenticated user',
	  };
	  let administrator = {
		  rid:'administrator',
		  name:'Administrator',
	  };	  
	  await Role.findOneAndUpdate({ rid: anonymous.rid}, anonymous, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });
	  
	  await Role.findOneAndUpdate({ rid: authenticated.rid}, authenticated, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });	

	  await Role.findOneAndUpdate({ rid: administrator.rid}, administrator, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });	  
			
	  // create an administrator
      let userObj = req.body;
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['administrator']; 
	  }

       const user = await new User(userObj).save();

	   //ctx.body = {message:"sucess"};
	   res.json({message:"sucess"});
       //ctx.body = user;

    } catch (err) {
	  console.log("err",err);
      //ctx.throw(422);
	  res.status(422).end();
    }
  }

}

export default new SystemController();
