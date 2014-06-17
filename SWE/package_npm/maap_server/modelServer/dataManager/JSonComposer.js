/** * File: JSonComposer.js * Module: maap_server::ModelServer::DataManager * Author: Alberto Garbui * Created: 04/05/14 * Version: 0.1 * Description: JSON composer... * Modification History: ============================================== * Version | Changes ============================================== * 0.1 File creation ============================================== */'use strict';exports.createCollectionsList = function(collectionsList) {	var collectionsLabels = [];	var collectionsNames = [];	var collectionsPositions = [];	for(var i=0; i<collectionsList.length; i++)	{		collectionsLabels.push(collectionsList[i].label);		collectionsNames.push(collectionsList[i].name); 		collectionsPositions.push(collectionsList[i].position);	}		//carico la lista di collections su data		var json =  {};	json.labels = collectionsLabels;	json.data = collectionsNames;	json.positions = collectionsPositions;			var jsonString = JSON.stringify(json);		return jsonString;}var checkLabels = function(labelsArray) {	for(var i=0; i<labelsArray.length; i++)	{		if(labelsArray[i].indexOf('__IDLABEL2SHOW__') == 0 || labelsArray[i] == '_id')			return true;	}	return false;}exports.createCollection = function(labels,data,config) {	var dataArray = [];	var idLabelIsPresent = checkLabels(labels);		for(var i=0; i<data.length; i++) {		var obj = data[i];		var dataBlock = {}						//creo un blocco dati		dataBlock._id = obj._id;				//ID del document, sempre presente		dataBlock.data = {};				for(var attributename in obj){		console.log(attributename + ': ' + obj[attributename]);			if(attributename != '_id' )			{				dataBlock.data[attributename] = obj[attributename]; //carico l'attributo			}else{				if(idLabelIsPresent)				{					for(var j=0; j<labels.length; j++)					{						//pulisco l'etichetta						if(labels[j].indexOf('__IDLABEL2SHOW__') == 0)							labels[j] = labels[j].substr(16);					}					dataBlock.data[attributename] = obj[attributename];				}			}		}			console.log(dataBlock);			dataArray.push(dataBlock);	}		//creo il json principale: un array di labels, data e config	var json = [];	json.push(labels);	json.push(dataArray);	json.push(config);		console.log('JSONcomposerCOL:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};exports.createDocument = function(labels,data) {	//creo il json principale: un array di labels, e data 	var json = {};	json.label = labels;	json.data = {};		var idLabelIsPresent = checkLabels(labels);			for(var attributename in data)	{		if(attributename != '_id' )		{			json.data[attributename] = data[attributename]; //carico l'attributo		}else{			if(idLabelIsPresent)			{				for(var j=0; j<labels.length; j++)				{					//pulisco l'etichetta					if(labels[j].indexOf('__IDLABEL2SHOW__') == 0)						labels[j] = labels[j].substr(16);				}				json.data[attributename] = data[attributename];			}		}	}		console.log('JSONcomposerDOC:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};exports.createQueriesList = function(queries){	//creo il json principale: un array di labels, e data 	var json = {};	json.label = [];	json.data = queries;		//carico le etichette	json.label.push('Collection Name');	json.label.push('Selected fields');				console.log('JSONcomposerQUERIES:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};exports.createIndexesList = function(indexes){	//creo il json principale: un array di labels, e data 	var json = {};	json.label = [];	json.data = [];		//carico le etichette	json.label.push('Collection Name');	json.label.push('Selected fields');			for(var i=0; i<indexes.length; i++)	{		var dataBlock = {};		dataBlock.collection_name = indexes[i].collection_name;		dataBlock.select = JSON.stringify(indexes[i].select);		json.data.push(dataBlock);	}			console.log('JSONcomposerINDEXES:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};exports.createUserProfile = function(user){	//creo il json principale: un array di labels, e data 	var json = {};	json.label = [];	json.data = {};		//carico le etichette	json.label.push('Email');	json.label.push('Password');	json.label.push('Level');	json.data['email'] = user.email;	json.data['password'] = user.password;		if(user.level == 0)	{		json.data['level'] = 'user';	}else{		json.data['level'] = 'administrator';	}			console.log('JSONcomposerUserProfile:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};exports.createUsersList = function(users){	//creo il json principale: un array di labels, e data 	var labels = [];	var data = [];		//carico le etichette	labels.push('ID');	labels.push('Email');			for(var i=0; i<users.length; i++)	{		var dataBlock = {};		dataBlock._id = users[i]._id;		dataBlock.data = {};		dataBlock.data._id = users[i]._id;		dataBlock.data.email = users[i].email;		data.push(dataBlock);	}			var json = [];	json.push(labels);	json.push(data);		console.log('JSONcomposerUSERLIST:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};//per l'adminexports.createUser = function(user){	//creo il json principale: un array di labels, e data 	var json = {};	json.label = [];	json.data = {};		//carico le etichette	json.label.push('ID');	json.label.push('Email');	json.label.push('Level');	json.data.id = user._id;	json.data.email = user.email;		if(user.level == 0)	{		json.data.level = 'user';	}else{		json.data.level = 'administrator';	}		console.log('JSONcomposerUserForAdmins:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};