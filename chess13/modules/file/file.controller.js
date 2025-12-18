import File from './file.model.js';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { slugify } from 'transliteration';
import multer from 'multer';
import { rootDir } from '../../config.js';




class FileController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all files
   * @param {req, res, next} Express param
   */
  async find(req, res, next) {
	const query = req.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});

    const items =  await File.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();

	const withCount =  query.withCount || '';
	if(withCount === "1"){					
	  const count = await File.find(filter).countDocuments().exec();	

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
   * Find a file
   * @param {req, res, next} Express param
   */
  async findById(req, res, next) {
    try {
      const file = await File.findById(ctx.params.id);
      if (!file) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = file;
	  res.json(file);
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
   * Add a file
   * @param {req, res, next} Express param
   */
  async add(req, res, next) {
    try {

	  var file = new File(ctx.request.body);
	  const fileReturn = file.save();
      //ctx.body = fileReturn;
	  res.json(fileReturn);

    } catch (err) {
      //ctx.throw(422);
	  res.status(422).end();
    }
  }

  /**
   * Update a file
   * @param {req, res, next} Express param
   */
  async update(req, res, next) {
    try {
	  var opts = { runValidators: true };
      const file = await File.findByIdAndUpdate(
        req.params.id,
        req.body,
		opts
      );
      if (!file) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = file;
	  res.json(file);
    } catch (err) {file
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        //ctx.throw(404);
		res.status(404).end();
      }
	  //ctx.body =  err;
	  res.status(500).end();

    }
  }

  /**
   * Delete a file
   * @param {req, res, next} Express param
   */
  async delete(req, res, next) {
    try {
      const file = await File.findByIdAndRemove(ctx.params.id);
      if (!file) {
        //ctx.throw(404);
		res.status(404).end();
      }
      //ctx.body = file;
	  res.json(file);
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
   * upload file
   * @param {req, res, next} Express param
   */
  async upload(req, res, next) {

	

//console.log("req", req);

		let dirPredix = 'file';
		let yearMonth = moment().format('YYYY-MM')
	
	let file = req.file; 
	//console.log("file", file);
	
	//将保存的文件，存到数据库可以管理的文件系统中
	
		let account = res.locals.user || {};
		console.log('account1',account);
		//let uri =;
		let fileObj = {
		  filename:file.filename,
		  uri:`public://upload/${dirPredix}/${yearMonth}/` + file.filename,
		  filemime:file.filemime,
		  filesize:file.size,
		  status:true,
		  uid: account._id || null,
		};
		
	  var fileModel = new File(fileObj);

      let fileRet = await fileModel.save();	
	  res.json(fileRet);	
	  // res.json({
		//   msg:"success",
	  // }); 
        //let file = ctx.request.file; // get uploaded file
        // create read stream/
		/*
		console.log("console.log(req.files);",req.files);
        const reader = fs.createReadStream(req.files['file']['path']);
		let dirPredix = 'file';
		console.log(req.files);

        // create write stream
		let yearMonth = moment().format('YYYY-MM')
		const staticPath = `../../../public/upload/${dirPredix}/${yearMonth}`;
		//make sure dir exist
		let dirpath = path.join( __dirname, staticPath);
		if(!fs.existsSync(dirpath)){
			fs.mkdirSync(dirpath, { recursive: true });
		}
        let cleanfilename = slugify(req.files['file']['name'], { lowercase: true, separator: '_' });
        let filePath = dirpath + '/' + cleanfilename;
		
		//console.log('filePath',filePath);
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
		fs.unlinkSync(req.files['file']['path']);
		
		//let account = req.state.user || {}; 
		
		let account = res.locals.user || {};
		console.log('account1',account);
		//let uri =;
		let fileObj = {
		  filename:req.files['file']['name'],
		  uri:`public://upload/${dirPredix}/${yearMonth}/` + cleanfilename,
		  filemime:req.files['file']['type'],
		  filesize:req.files['file']['size'],
		  status:true,
		  uid: account._id || null,
		};
	  var fileModel = new File(fileObj);

      let file = await fileModel.save();	
	  res.json(file);
	  */
 
  }
  /* eslint-enable no-param-reassign */
}

export default new FileController();
