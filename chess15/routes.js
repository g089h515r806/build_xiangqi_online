import glob from 'glob';
//import { rootDir } from './config.js';

export default async function(app) {
    //const files = glob.sync( `${rootDir}/modules/*/*.route.js`);
    const files = glob.sync( `./modules/*/*.route.js`);		
	
	for (var i=0; i<files.length; i++){ 
	  let filepath = files[i];
	   let router =  await import(filepath);
	   app.use( router.default);	 
     // console.log("router", router.default);	   
      //document.write(cars[i] + "<br>");
    }

}
