//导入 model


class UserController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all cities
   * @param {ctx} Koa Context
   */
  async find(req, res) {
	  try {
		//const query = await checkQueryString(req.query)
		res.send('respond with a resource1使用传统方式');
	  } catch (error) {
		//handleError(res, error)
		res.send('respond with an error使用传统方式');
	  }

  }
  

 
  /* eslint-enable no-param-reassign */
}

export default new UserController();
