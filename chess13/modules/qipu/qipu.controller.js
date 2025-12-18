import aqp from 'api-query-params';
//import ejs from 'ejs';
import Qipu from './qipu.model.js';


class QipuController {

  /* eslint-disable no-param-reassign */

  /**
   * Get all qipu
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {
    try {
		const query = req.query;  
		const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});

		const items =  await Qipu.find(filter)
							.skip(skip)
							.limit(limit)
							.sort(sort)
							.select(projection)
							.populate(population)
							.exec();


		let withCount = "";
		if(withCount === "1"){					
		  const count = await Qipu.find(filter).countDocuments().exec();	

		  res.json({
			items:items,
			count:count,
		  });
		}else{
		  res.json({
			items:items,
		  });	
		}	  
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {

		res.status(404).end();
      }
	  res.status(500).end();
    }	
  }

  /**
   * Find a qipu
   * @param {req, res, next} Express param
   */
  async findById(req, res, next) {
    try {
      const qipu = await Qipu.findById(req.params.id).
	  populate({
		path: 'players',
		select: 'name _id'
	  }).exec();


      if (!qipu) {
        //ctx.throw(404);  Koa代码
		res.status(404).end();
      }
	  res.json(qipu);

    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {

		res.status(404).end();
      }
	  res.status(500).end();
    }
  }

  /**
   * Add a qipu
   * @param {req, res, next} Express param
   */
  async add(req, res, next) {
    try {

	  let requestBody = req.body || {};
  
	  var qipu = new Qipu(requestBody);
	  
	  let ret = await qipu.save();
	   res.json(ret);

    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }		
      //ctx.throw(422);
	  res.status(422).end();
    }
  }

  /**
   * Update a qipu
   * @param {req, res, next} Express param
   */
  async update(req, res, next) {
    try {
	  var opts = { runValidators: true };
	  //console.log("user",ctx.state.user);
	  let requestBody = req.body || {};
	  let  qipu = await Qipu.findByIdAndUpdate(
		req.params.id,
		requestBody,
		opts
	  );
		  
	  
      if (!qipu) {
        //ctx.throw(404);
		res.status(404).end();
      }

	  res.json(qipu);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }
	  //ctx.body =  err;
	  res.status(422).end();

    }
  }

  /**
   * Delete a qipu
   * @param {req, res, next} Express param
   */
  async delete(req, res, next) {
    try {
      const qipu = await Qipu.findByIdAndRemove(req.params.id);
      if (!qipu) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = qipu;
	  res.json(qipu);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.throw(500);
	  res.status(500).end();
    }
  }
  



  /* eslint-enable no-param-reassign */
}

export default new QipuController();
