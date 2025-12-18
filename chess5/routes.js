import glob from 'glob';
import { rootDir } from './config.js';

export default async function(app) {
    //const files = glob.sync( `${rootDir}/modules/*/*.route.js`);
    const files = glob.sync( `./modules/*/*.route.js`);		
	
	for (var i=0; i<files.length; i++){ 
	  let filepath = files[i];
	   let router =  await import(filepath);
	   app.use( router.default);	 
      console.log("router", router.default);	   
      //document.write(cars[i] + "<br>");
    }
	/*	
	files.forEach(filepath => {
	  //let router = require(filepath); // eslint-disable-line global-require, import/no-dynamic-require
	  // routes.push(route);
	  console.log("filepath", filepath);
     // app.use(router.default);
	  
       import(`${filepath}`)
		  .then((module) => {
			//module.loadPageInto(main);
			console.log("router", router);
			app.use(module.default);
		  })
		  .catch((err) => {
			//main.textContent = err.message;
			console.log("err", err);
		  });		  

	});
  */
}
