/** * File: JSonComposer.js * Module: maap_server::ModelServer::DataManager * Author: Alberto Garbui * Created: 04/05/14 * Version: 0.1 * Description: JSON composer... * Modification History: ============================================== * Version | Changes ============================================== * 0.1 File creation ============================================== */'use strict';exports.createCollectionsList = function(collectionsList) {	var collectionsLabels = [];	var collectionsNames = [];	var collectionsPositions = [];	for(var i=0; i<collectionsList.length; i++)	{		collectionsLabels.push(collectionsList[i].label);		collectionsNames.push(collectionsList[i].name); 		collectionsPositions.push(collectionsList[i].position);	}		//carico la lista di collections su data		var json =  {};	json.labels = collectionsLabels;	json.data = collectionsNames;	json.positions = collectionsPositions;			var jsonString = JSON.stringify(json);		return jsonString;}var checkLabels = function(labelsArray) {	for(var i=0; i<labelsArray.length; i++)	{		if(labelsArray[i].indexOf('__IDLABEL2SHOW__') == 0 || labelsArray[i] == '_id')			return true;	}	return false;}exports.createCollection = function(labels,data,config) {	var dataArray = [];	var idLabelIsPresent = checkLabels(labels);		for(var i=0; i<data.length; i++) {		var obj = data[i];		var dataBlock = {}						//creo un blocco dati		dataBlock._id = obj._id;				//ID del document, sempre presente		dataBlock.data = {};				for(var attributename in obj){		console.log(attributename + ': ' + obj[attributename]);			if(attributename != '_id' )			{				dataBlock.data[attributename] = obj[attributename]; //carico l'attributo			}else{				if(idLabelIsPresent)				{					for(var j=0; j<labels.length; j++)					{						//pulisco l'etichetta						if(labels[j].indexOf('__IDLABEL2SHOW__') == 0)							labels[j] = labels[j].substr(16);					}					dataBlock.data[attributename] = obj[attributename];				}			}		}			console.log(dataBlock);			dataArray.push(dataBlock);	}		//creo il json principale: un array di labels, data e config	var json = [];	json.push(labels);	json.push(dataArray);	json.push(config);		console.log('JSONcomposerCOL:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};exports.createDocument = function(labels,data) {	//creo il json principale: un array di labels, e data 	var json = {};	json.label = labels;	json.data = {};		var idLabelIsPresent = checkLabels(labels);			for(var attributename in data)	{		if(attributename != '_id' )		{			json.data[attributename] = data[attributename]; //carico l'attributo		}else{			if(idLabelIsPresent)			{				for(var j=0; j<labels.length; j++)				{					//pulisco l'etichetta					if(labels[j].indexOf('__IDLABEL2SHOW__') == 0)						labels[j] = labels[j].substr(16);				}				json.data[attributename] = data[attributename];			}		}	}		console.log('JSONcomposerDOC:');	console.log(json);		var jsonString = JSON.stringify(json);	return jsonString;};