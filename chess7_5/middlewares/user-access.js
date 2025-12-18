import UserService from '../modules/user/user.service.js';
//export default
//老式写法
//module.exports = function userAccess(permission) {
export default	function userAccess(permission) {
    return async function(req, res, next) {
        //console.log("reqauth", req.auth);
		//let user = res.locals.user || {};
		//express-jwt 将验证后的信息默认存在了req.auth里面
		let user = req.auth || {};
		let name = user.name ||  "";
		//when user not exist, use anonymous user
		if( name === ""){
			user = {
				name:"Anonymous",
				roles:['anonymous']
			};
			res.locals.user = user;
			//console.log("user", user);
		}else{
			//load user by name
		    user = await UserService.loadUserByName(name);
			res.locals.user = user || {};
		}		
		let account = res.locals.user || {};
		//console.log("user", user);
		
		//console.log("account", account);
		let hasPermission = await UserService.userAccess(permission, account);
		if(!hasPermission){
			//ctx.throw(403);
			res.status(403).end();
	    }		

        await next();
    };
};