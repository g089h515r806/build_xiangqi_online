import aqp from 'api-query-params';
//import ejs from 'ejs';
import {Content, Page, Article} from './content.model.js';


class ContentController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all content
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {

	const query = req.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});

    const items =  await Content.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();

    //const contents = await ejs.renderFile('src/views/contents.ejs', {contents:items}, {async: true});	
    //res.render('index', { title: 'content find', main_content: contents });
	//const withCount =  query.withCount || '';
	let withCount = "";
	if(withCount === "1"){					
	  const count = await Content.find(filter).countDocuments().exec();	

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
   * Find a content
   * @param {req, res, next} Express param
   */
  async findById(req, res, next) {
    try {
      const content = await Content.findById(req.params.id).
	  populate({
		path: 'uid',
		select: 'name _id'
	  }).populate('category').populate('image').populate('audio').populate('video').exec();
	  //const content = await Content.findById(ctx.params.id);

      if (!content) {
        //ctx.throw(404);
		res.status(404).end();
      }
	  res.json(content);
      //ctx.body = content;
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
   * Add a content
   * @param {req, res, next} Express param
   */
  async add(req, res, next) {
    try {
	  //console.log(ctx.request);
	  //console.log(ctx.request.body);
	  let requestBody = req.body || {};
	  if(!requestBody.uid){
		//requestBody.uid = req.state.user._id || null;  
	  }	  
	  var content = new Content(requestBody);
	  

	  //var errors = Contact.validateSync();
	  //console.log(errors);
	  let ret = await content.save();
	   res.json(ret);

    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end();
    }
  }

  /**
   * Update a content
   * @param {req, res, next} Express param
   */
  async update(req, res, next) {
    try {
	  var opts = { runValidators: true };
	  //console.log("user",ctx.state.user);
	  let requestBody = req.body || {};
	  if(!requestBody.uid){
		requestBody.uid = req.state.user._id || null;  
	  }		  
	  let type = req.body.type || "Page";
	  let content = {};
	  if(type === "Page"){
		  content = await Page.findByIdAndUpdate(
			req.params.id,
			requestBody,
			opts
		  );
	  }else if(type === "Article"){
		  content = await Article.findByIdAndUpdate(
			req.params.id,
			requestBody,
			opts
		  );		  
	  }
	  
      if (!content) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = content;
	  res.json(content);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }
	  ctx.body =  err;

    }
  }

  /**
   * Delete a content
   * @param {req, res, next} Express param
   */
  async delete(req, res, next) {
    try {
      const content = await Content.findByIdAndRemove(req.params.id);
      if (!content) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = content;
	  res.json(content);
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.throw(500);
	  res.status(500).end();
    }
  }
  
  async viewCount(req, res, next) {
    try {
			
	  const updatedContent = await Content.findByIdAndUpdate(
		req.params.id,
		{
			$inc: { viewCount: 1 }
		},
		{ new: true } //to return the new document
	  );
      res.json( {message:"success"});
      //ctx.body = {message:"success"};
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

export default new ContentController();
