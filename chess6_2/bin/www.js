#!/usr/bin/env node

/**
 * Module dependencies.
 */

//var app = require('../app');
import app from '../app.js';
//var debug = require('debug')('chess:server');
import debug from 'debug';
//var http = require('http');
import http from 'http';
import expressWs from 'express-ws';
import cookieParser from 'cookie-parser';
import session from 'express-session';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const sessionParser2 = cookieParser();
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

server.on('upgrade', function (request, socket, head) {
	console.log("upgrade0", 'upgrade0');
	//console.log("cookienew", request);
 sessionParser(request, {}, () => {
	  console.log("upgrade", 'upgrade');
	   console.log("session", request.session);
	   console.log("userId", request.session.userId);
	  /*
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
	*/

    console.log('session is parsed!');
    /*
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    }); */
  });	
});



var wsInstance  = expressWs(app, server);

//var wss = wsInstance.getWss();


//server.on('upgrade', function upgrade(request, socket, head) {
  // This function is not defined on purpose. Implement it with your own logic.
//  console.log("upgrade", 'upgrade');
  
  //  wss.handleUpgrade(request, socket, head, function done(ws) {
    //  wss.emit('connection', ws, request, client);
   // });  
  /*
  authenticate(request, function next(err, client) {
    if (err || !client) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, client);
    });
  }); */
//});
  /*
wss.on('connection', function connection(ws, request, client) {
	
	console.log("connection", 'connection');
	  console.log("cookiewsc", request.cookies);
	   console.log("authc", request.auth);
    console.log("ws", ws);	   

  ws.on('message', function message(data) {
    console.log(`Received message ${data} from user ${client}`);
  });
  
});*/
// {wsOptions:{clientTracking:false}}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  //debug('Listening on ' + bind);
  debug('chess:server')('Listening on ' + bind);
  
}
