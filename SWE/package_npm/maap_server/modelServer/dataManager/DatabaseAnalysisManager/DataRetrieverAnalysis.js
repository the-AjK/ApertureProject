/**
 * File: DataRetrieverAnalysis.js
 * Module: maap_server::ModelServer::DataManager::DatabaseAnalysisManager
 * Author: Alberto Garbui
 * Created: 20/05/14
 * Version: 0.1
 * Description: recupero dati dal database di analisi
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

//var DB = require('../../Database/MongooseDBAnalysis');

var getModel = function(collection_name) {
	var DB = require('../../Database/MongooseDBAnalysis');
	var array = DB.model;
	
	for(var i=0; i<array.length; i++)
	{
		if(array[i].name == collection_name)
		{
			return array[i].model;
		}
	}
	return -1;
}

var getDocuments = function(model, where, select, orderbycolumn, typeorder, startskip, numberofrow, populate, callback){
	
	var options = {};
	if(orderbycolumn != '' && typeorder != ''){
		var sort = {};
		sort[orderbycolumn] = typeorder;
		options.sort = sort;
	}
	if(numberofrow != ''){
		options.limit = numberofrow;
	}
	if(startskip != ''){
		options.skip = startskip;
	}
		
	var query = model.find(where, select, options);
	
	console.log(options);
	
	if(populate != [])
	{
		var populatePath = [];
		var populateField = [];
		
		for(var i=0; i< populate.length; i++)
		{
			populatePath.push(populate[i].key);
			populateField.push(populate[i].field);
		}

		var selectPopulate = [];	
		for(var i=0; i<populateField.length; i++)
		{
			selectPopulate[populateField[i]]=1;
		}	
		
		for(var i=0; i<populatePath.length; i++)
		{
			query.populate({
				path: populatePath[i],
				select: selectPopulate[i]
			})
		}
	}
		
	query.lean().exec( function(err,result){
		if(err){console.log('query fallita'); return;}
		if(!result){
		console.log('nessun risultato') 
		}else{
			//se � stato specificato il populate, sostituisco i vari populate...
			console.log(result);
			
			if(populate!=[])
			{
				for(var i=0; i<result.length; i++)
				{
					var obj = result[i];
					//estraggo le informazioni corrette
					for(var attributename in obj)
					{
						for(var j=0; j<populatePath.length; j++)
						{
							if(attributename == populatePath[j])
							{
								var newfield = obj[populatePath[j]][populateField[j]];
								obj[populatePath[j] + '.' + populateField[j]] = newfield;
							}
						}
					}
								
					//pulisco i campi populate
					for(var attributename in obj)
					{
						for(var j=0; j<populatePath.length; j++)
						{
							if(attributename == populatePath[j])
							{
								delete obj[populatePath[j]];
							}
						}
					}

				}
			}
			callback(result);
			
		}
	});	
}

exports.getCollectionsList = function() {
	var collectionsList = require('../../DSL/collectionData/collectionsList.json');
	return collectionsList;
}

var extractPopulate = function(populateArray, key) {
	for(var i=0; i<populateArray.length; i++){
		if(populateArray[i].key == key){
			return getModel(populateArray[i].collection);
		}
	}
	return '';
}

exports.getCollectionIndex = function(collection_name, column, order, page, callback) {

	var model = getModel(collection_name);
	var collection = require('../../DSL/collectionData/' + collection_name + '.json').collection;
	var columns = collection.index.column;
	
	//generazione array di labels
	var labels = [];
	for(var i=0; i<columns.length; i++){
		if(columns[i].label != null)
		{
			labels[i] = columns[i].label;
		}else{
			labels[i] = columns[i].name;
		}
	}
	
	var select = {};
	var populate = [];
	//var populate = [{field: 'name', key: 'coach'},{field: 'name', key: 'coach2'},{field: 'nome', key: 'market'}];
	for(var i=0; i<columns.length; i++){
	    var name = columns[i].name.split('.');
	    if(name.length > 1){
			var data = {};
			data.field = name[1];
			data.key = name[0];
			populate.push(data);
		}
		select[name[0]] = 1; 
	}//for
	
	//se la colonna non e' specificata uso le impostazioni del DSL, altrimenti uso le impostazioni
	//derivate dalla richiesta del client
	if(column == undefined)
	{
		var sortby = collection.index.sortby;
		order = collection.index.order;
	}else{
		var sortby = column;
	}
	
	var perpage = collection.index.perpage;
	var start = perpage * page;
	var query;
	if(collection.index.query == null)
		query = {};
	else
		query = collection.index.query;
	
	getDocuments(model,
				query, 				//where
				select,				//select 
				sortby, 			//colonna da ordinare
				order,				//tipo ordinamento
				start,				//partenza
				perpage,			//elementi per pagina
				populate,			//populate
				function(documents){
					var result = {}
					result.labels = labels;		
					result.documents = documents;
					callback(result);
				});
}

exports.getDocumentShow = function(collection_name, document_id, callback) {

	var model = getModel(collection_name);
	var collection = require('../../DSL/collectionData/' + collection_name + '.json').collection;
	var rows = collection.show.row;
	
	//generazione array di labels
	var labels = [];
	for(var i=0; i<rows.length; i++){
		if(rows[i].label != null)
		{
			labels[i] = rows[i].label;
		}else{
			labels[i] = rows[i].name;
		}
	}
	
	var select = {};
	var populate = [];
	for(var i=0; i<rows.length; i++){
	    var name = rows[i].name.split('.');
	    if(name.length > 1){
			var data = {};
			data.field = name[1];
			data.key = name[0];
			populate.push(data);
		}
		select[name[0]] = 1; 
	}//for
	
	var query = {};
	query._id = document_id;
	
	getDocuments(model,
				query, 				//where
				select,				//select 
				'', 				//colonna da ordinare
				'',					//tipo ordinamento
				0,					//partenza
				'',					//elementi per pagina
				populate,			//populate
				function(documents){
					var result = {}
					result.labels = labels;		
					result.rows = documents[0];
					callback(result);
				});
}

exports.updateDocument = function(collection_name, document_id, newDocumentData, callback) {
	var model = getModel(collection_name);
	
	var criteria = {};
	criteria._id = document_id;
		
	var options = {};
	
	var query = model.update(criteria, {$set: newDocumentData}, options);
	query.lean().exec( function(err, count){
		if(err){console.log('document update fallito'); return;}
		if(count==0){
			console.log('nessun risultato'); 
		}else{
			//update avvenuto con successo, che fare ora?
			callback();
		}
	});
}

exports.removeDocument = function(collection_name, document_id, callback) {
	var criteria = {};
	criteria._id = document_id;
	
	var model = getModel(collection_name);
	
	var query = model.remove(criteria);
	query.lean().exec( function(err, count){
		if(err){console.log('rimozione document fallita'); return;}
		if(count == 0) {
			console.log('nessun risultato'); 
		}else{
			
			//rimozione avvenuta con successo, che fare ora?
			callback();
			
		}//else
	});

}
	