import aqp from 'api-query-params';
import {Vocabulary, Term} from './taxonomy.model.js';

class TaxonomyController {

  /**
   * Get all vocabulary
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {

    try {
      let vocs = await Vocabulary.find();
	  res.json(vocs);
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
   * Find a vocabulary
   * @param {req, res, next} Express param
   */
  async findById(req, res, next) {
    try {
      const vocabulary = await Vocabulary.findById(req.params.id);
      if (!vocabulary) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = vocabulary;
	  res.json(vocabulary);
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
   * Add a vocabulary
   * @param {req, res, next} Express param
   */
  async add(req, res, next) {
    try {
      const vocabulary = await new Vocabulary(req.body).save();
      //ctx.body = vocabulary;
	  res.json(vocabulary);
    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end();
    }
  }

  /**
   * Update a vocabulary
   * @param {req, res, next} Express param
   */
  async update(req, res, next) {
    try {
      const vocabulary = await Vocabulary.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!vocabulary) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = vocabulary;
	  res.json(vocabulary);
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
   * Delete a vocabulary
   * @param {req, res, next} Express param
   */
  async delete(req, res, next) {
    try {
      const vocabulary = await Vocabulary.findByIdAndRemove(req.params.id);
	  

	  
      if (!vocabulary) {
        //ctx.throw(404);
		res.status(404).end();
      }
	  
	  //delete related terms,  delete it carefully 
	  Term.deleteMany({ vocabulary: req.params.id});
	  
      //ctx.body = vocabulary;
	  res.json(vocabulary);
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
   * Get all term of a vocabulary
   * @param {req, res, next} Express param
   */
  async findTermsByVocCode(req, res, next) {
	const vocCode = req.params.code;  
	//console.log(vid);
	const query = req.query;  
	
	const vocIds = await Vocabulary.find({ code: { $in:  [vocCode] } }).distinct('_id');
	//console.log(vocIds);
	var vid = vocIds[0] || null;
	
	const items = await Term.find({ vocabulary:vid }).exec(); 

	res.json(items);
	//ctx.body = items;
  }

  async findTermsByCodes(req, res, next) {
	//const vocCode = ctx.params.code;  
	//console.log(vid);
	const query = req.query;  
    let codes = query.codes || '';
	let code_arr = codes.split(",");
	let ret = {};

   for (let code of code_arr) {
	//code_arr.forEach(function(code){
		let vocIds = await Vocabulary.find({ code: { $in:  [code] } }).distinct('_id');
		let vid = vocIds[0] || null;

		let items = await Term.find({ vocabulary:vid },  {name:1, code:1, parent:1,_id:1}).exec(); 
		ret[code] = items;
    };
	res.json(ret);
	//ctx.body = ret;
  }  
  
  /**
   * Get all term of a vocabulary
   * @param {req, res, next} Express param
   */
  async findTerms(req, res, next) {
	const vid = req.params.vid; 
	const query = req.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});
	
	console.log("filter", filter);

    const items =  await Term.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){
	  const count = await Term.find(filter).countDocuments().exec();	
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
   * Find a term
   * @param {req, res, next} Express param
   */
  async findTermById(req, res, next) {
    try {
      const term = await Term.findById(req.params.id);
      if (!term) {
        //ctx.throw(404);
		res.status(404).end();
      }
	  res.json(term);
      //ctx.body = term;
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
   * Add a term
   * @param {req, res, next} Express param
   */
  async addTerm(req, res, next) {
	//console.log('body',req.body);
    try {
	  //set value for vocabulary
      var request_body = req.body;
      const term = await new Term(request_body).save();
      //ctx.body = term;
	  res.json(term);
    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end();
    }
  }

  /**
   * Update a term
   * @param {req, res, next} Express param
   */
  async updateTerm(req, res, next) {
    try {
      const term = await Term.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!term) {
        //ctx.throw(404);
		res.status(404).end();
      }
	  res.json(term);
      //ctx.body = term;
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
   * Delete a term
   * @param {req, res, next}  Express param
   */
  async deleteTerm(req, res, next) {
    try {
      const term = await Term.findByIdAndRemove(req.params.id);
      if (!term) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = term;
	  res.json(term);
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

export default new TaxonomyController();
