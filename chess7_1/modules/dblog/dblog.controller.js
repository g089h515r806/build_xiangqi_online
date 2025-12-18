import aqp from 'api-query-params';
import Watchdog from './dblog.model.js';

class DblogController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all log
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {
	const query = req.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});
	
	console.log("filter", filter);

    const items =  await Watchdog.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){
	  const count = await Watchdog.find(filter).countDocuments().exec();	

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
   * Find a log
   * @param {req, res, next} Express param
   */
  async findById(req, res, next) {
    try {
      const log = await Watchdog.findById(ctx.params.id);
      if (!log) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = log;
	  res.json(contact);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.throw(500);
	  res.status(500).end();
    }
  }


}

export default new DblogController();
