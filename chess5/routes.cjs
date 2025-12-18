//import glob from 'glob';
var glob = require('glob');
//import { rootDir } from './config.js';

async function  routing(app) {
   // const files = glob.sync( `${__dirname}/modules/*/*.route.js`);	
	const files = glob.sync( `./modules/*/*.route.js`);	
	console.log("__dirname", __dirname);
	console.log("files", files);
	
	for (var i=0; i<files.length; i++){ 
	  let filepath = files[i];
	   let router =  await import(filepath);
	   app.use( router.default);	 
      console.log("router", router.default);	   
      //document.write(cars[i] + "<br>");
    }
	
	files.forEach(filepath => {
	 // let router = require(filepath); // eslint-disable-line global-require, import/no-dynamic-require
	//   routes.push(route);
	//  console.log("filepath", filepath);
     // app.use(router.default);
	 
	// let router =  await import(filepath);
	// app.use('/todos', router.default);
	 
	 /*
	    import(filepath)
       //import(`${filepath}`)
		  .then((module) => {
			//module.loadPageInto(main);
			console.log("module", module.default);
			app.use('/todos', module.default);
		  })
		  .catch((err) => {
			//main.textContent = err.message;
			console.log("err", err);
		  });	*/	 

	});
  
}

module.exports = routing;
