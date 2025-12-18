//'use strict';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import moment from 'moment';
import path from 'path';
import { slugify } from 'transliteration';
import { baseApi, rootDir } from '../../config.js';
import userAccess from '../../middlewares/user-access.js';
import FileController from './file.controller.js';


const api = 'file';

const router = express.Router();

//router.prefix(`/${baseApi}/${api}`);

// GET /api/file
router.get(`/${baseApi}/${api}`, userAccess('access file'), FileController.find);


// POST /api/file
router.post(`/${baseApi}/${api}`, userAccess('create file'), FileController.add);

// GET /api/file/id
router.get(`/${baseApi}/${api}/:id`, userAccess('access file'), FileController.findById);

// PUT /api/file/id
router.put(`/${baseApi}/${api}/:id`, userAccess('edit file'), FileController.update);

// DELETE /api/file/id
router.delete(`/${baseApi}/${api}/:id`, userAccess('delete file'), FileController.delete);



// 通过 filename 属性定制
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		
		// 
		let dirPredix = 'file';
		let yearMonth = moment().format('YYYY-MM')
		const staticPath = `../public/upload/${dirPredix}/${yearMonth}`;
		//make sure dir exist
		let dirpath = path.join( rootDir, staticPath);
		if(!fs.existsSync(dirpath)){
			fs.mkdirSync(dirpath, { recursive: true });
		}

         console.log("dirpath", dirpath);		
		cb(null, dirpath);    // 保存的路径，备注：需要自己创建
	},
	filename: function (req, file, cb) {
		// 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
		cb(null, slugify(file.originalname, { lowercase: true, separator: '_' }) );  
	}
});	
var upload = multer({ storage: storage });	


router.post(`/${baseApi}/${api}/upload`, upload.single('file'), FileController.upload);

/*
router.post(`/${baseApi}/${api}/upload`, koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 20 * 1024 * 1024    // set max file size，default 20M
        }
    }), FileController.upload);
	*/


export default router;
