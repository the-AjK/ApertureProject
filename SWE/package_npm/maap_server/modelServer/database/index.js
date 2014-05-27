/** * File: index.js * Module: maap_server::modelServer::database * Author: Alberto Garbui * Created: 12/05/14 * Version: 0.1 * Description: inizializzazione database * Modification History: ============================================== * Version | Changes ============================================== * 0.1 File creation ============================================== */'use strict';var mongoose = require('mongoose');var initDB = function(app) {	var config = app.config;			var userDB2connect = 'mongodb://' + config.userDB.host + ':' + config.userDB.port + config.userDB.path;		console.log('connecting to user db: ' + userDB2connect + ' ...');		mongoose.connect(userDB2connect, function(err){		if(err)			console.error('connection failed! check your mongodb path');		else			console.error('successfully connected to user\'s database!');	});};exports.init = initDB;