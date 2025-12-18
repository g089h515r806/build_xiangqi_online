import Watchdog from './dblog.model.js';

class DblogService {
  /* eslint-disable no-param-reassign */

  /**
   * Get all permissions
   * 
   */
  async watchdog(type, message, severity, req) {

    try {
	  let name = "";
	  let location = "";
	  let hostname = "";
	  //ctx defined
	  if(req){
	    let user = req.user || {};
	    name = user.name || '匿名用户';
		location = req.url || "";
		hostname = this.getClientIP(req);
	  }

	  let log = {
		username : name,
		type : type,
        message : message,
        severity : severity,
		location : location,
        hostname : hostname,
        //hostname:"",		
	  };
	  //console.log(log);
	  var watchdog = new Watchdog(log);
	  await watchdog.save();
      return true;
    } catch (err) {
      return false;
    }
  }

  
  /**
   * @getClientIP
   * @desc 获取用户 ip 地址
   * @param {Object} req - 请求
   */
  getClientIP(req) {
	return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
		req.connection.remoteAddress || // 判断 connection 的远程 IP
		req.socket.remoteAddress || // 判断后端的 socket 的 IP
		req.connection.socket.remoteAddress; 
    
  }
}

export default new DblogService();
