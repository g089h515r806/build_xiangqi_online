import Todo from './todo.model.js';


class TodoController {

  /**
   * Get all contact
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {
	  try {
		//const query = await checkQueryString(req.query)
		res.send('返回Todo列表，使用模块方式');
	  } catch (error) {
		//handleError(res, error)
		res.send('返回Todo列表出错，使用模块方式');
	  }	  
  }
  



  /* eslint-enable no-param-reassign */
}

export default new TodoController();
