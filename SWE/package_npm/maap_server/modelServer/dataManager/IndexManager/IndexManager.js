/**
 * File: IndexManager.js
 * Module: maap_server::modelServer::dataManager::IndexManager
 * Author: Michele Maso + Fabio Miotto ;D
 * Created: 20/05/14
 * Version: 0.1
 * Description: gestione indici
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';
var DB = require('../../database/MongooseDBAnalysis');
var queryModel = require('../../database/MongooseDBFramework').query;
var connection = require('../../database/MongooseDBFramework').connection;

 /**
 * Recupera il file con la lista delle collections
 *
 *@return lista delle collections presenti nel sistema in formato json
 */
var getCollectionsListFile = function(){
	return require('../../DSL/collectionData/collectionsList.json');
}

 /**
 * Preleva il modello relativo ad una specifica collection
 *
 *@param collection_name - nome della collection relativa al modello da cercare
 *@return modello relativo alla collection specificata, -1 se il modello non � presente.
 */
var getModel = function(collection_name) {
	
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
//for unit test
exports.getModel = getModel;

 /**
 * Aggiunge una query nel database delle query
 *
 *@param collection_name - nome della collection relativa alla query da creare
 *@param select - lista di campi selezionati 
 */
exports.addQuery = function(collection_name, select) {
	
	//cerca tutte le query relative ad una determinata collection
	var findQueries = queryModel.find({collection_name: collection_name});
	findQueries.lean().exec(function(err,data){
		if(err)
		{
			console.log('Impossibile recuperare lista query con la collection: '+collection_name);
		}else{
			if(data.length == 0)
			{
				//se non e' presente nessuna query relativa alla collection specificata
				//creo una nuova query con il modello corretto, il nome della collection e la lista dei campi select
				//con contatore impostato ad uno
				var criteria = new queryModel({collection_name:collection_name, select:select, counter: 1});
				criteria.save(function(err){
					if(err)
					{
						console.log('inserimento query fallito: ' + err);
					}
				});
			}else{
			
				//se la query per la relativa collection e' gia' presente nel database
				var contadata = 0;
				
				//controllo se la lista dei campi selezionati e' identica a quella specificata
				for(var i = 0;i<data.length;i++){
				
					if(data[i].select.length == select.length){
						var countmatch = 0;
						for(var key in select){
							if(data[i].select[key] != undefined)
							{
								countmatch++;		
							}
						}
						
						//se la lista di campi select e' identica, devo incrementare solamente il campo counter
						if(countmatch == Object.keys(select).length){
							var counter = data[i].counter + 1;
							var id2update = data[i]._id;
							
							//aggiorno la query con il campo counter incrementato
							queryModel.update({_id: id2update}, {$set:{counter: counter}}).exec(function(err,count){
								if(err){console.log('update counter fallito: ' + err); }
								else if(count==0){
									//visualizzo l'errore in caso l'update non trova la query da aggiornare
									console.log('impossibile aggiornare la query.'); 
								}
							});
						}else{
							contadata++;
						}
					}
				}//for
				
				if(contadata == data.length)
				{
					//qui non ho fatto nessun update, quindi inserisco una nuova query con counter impostato
					//ad uno
					var criteria = new queryModel({collection_name:collection_name, select:select, counter: 1});
					criteria.save(function(err){
						if(err)
						{
							//visualizzo e stampo l'errore
							console.log('inserimento query fallito 2: ' + err);
						}
					});
				}
			}//else	
		}
	});
}

 /**
 * Rimuove tutte le query nel database
 *
 *@param callback - callback da richiamare al termine dell'esecuzione della funzione
 */
exports.resetQueries = function(callback) {
	
	//elimino l'intera collezione di query nel database
	connection.db.dropCollection(queryModel.modelName, function(err,data){
		if(err){
			//notifico l'utente in caso di errore
			console.log('Impossibile cancellare la collection '+ queryModel.modelName + ': ' + err);
			//richiamo la callback con false
			callback(false);
		}
		else{
			//in caso positivo richiamo la callback con true
			callback(true);
		}
	});
}

 /**
 * Recupera la lista di query presenti nel database
 *
 *@param page - numero di pagina da visualizzare
 *@param perpage - numero di query da visualizzare per pagina 
 *@param n_elements - numero di query totali da recuperare
 *@param callback - funzione da richiamare al termine dell'esecuzione
 */
exports.getQueries = function(page, perpage, n_elements, callback) {
	
	var options = {};
	
	options.skip = page * perpage;
	options.limit = perpage;
	options.sort = {counter:'desc'};
	
	var result = {};
	result.data = [];
	result.options = {};
	
	queryModel.find({}, function(err, queries){
		if(err) { console.log('errore recupero query list: ' + err); callback(result); }
		else if(!queries){
			console.log('no queries!');
			callback(result);
		}else{
			result.options.pages = Math.floor(queries.length / perpage);
			if((queries.length % perpage) > 0) result.options.pages++;
			
			var query = queryModel.find({},{},options);
			query.lean().exec(function(err,data){
				if(err){
					console.log('Impossibile ritornare le query');
					callback(result);
				}
				if(!data)
				{
					console.log('Non ci sono query da visualizzare');
				}else{
					result.data = data;
				}
				callback(result);
			});
		}		
	});
}

exports.getIndex = function(db, page, indexesPerPage, callback) {

	var result = [];
	var done = false;
	
	var collectionsList = getCollectionsListFile();
	
	for(var i=0; i<collectionsList.length; i++)
	{
		var collectionName = collectionsList[i].name;
		var collection = db.collection(collectionName);
		done = false;
		collection.indexInformation(function(err, indexes) {
			for(var key in indexes)
			{
				if(key != '_id_')	//non aggiungo gli indici di default _id_
					result.push({indexName: key, collectionName: collectionName, indexFields: indexes[key]});
			}
			done = true;
		});
		//voglio rendere la funzione sincrona per eseguire tutto il for e poi chiamare la callback
		while(!done){require('deasync').sleep(100);}
	}
	
	//TODO caricare solamente gli indici della pagina specificata
	
	callback(result);
	
}

exports.createIndex = function(query_id, name_index, callback) {
	
	var where = {};
	where['_id'] = query_id;
	var select = {};
	var query = queryModel.find(where,select);
	query.lean().exec(function(err,data){
		if(err){
			console.log('Impossibile ritornare la query dell\' indice');
			callback(false);
		}else if(!data)
		{
			console.log('Errore _id query cercata');
			callback(false);
		}else if(data.length > 0){
			//console.log(data);
					
			var collection_name = data[0].collection_name;			
			var fieldIndex = data[0].select;
			var index = {};
			for(var key in fieldIndex){
				index[key] = 1;
			}
			
			//imposto il nome dell'indice
			name_index = query_id;
			
			var nameindex = {};
			nameindex.name = name_index;
			var collectionSchema = require('../../DSL/collectionData/'+collection_name+'_schema').schema;
			collectionSchema.index(index, nameindex);
					
			var collectionModel = getModel(collection_name);
			collectionModel.ensureIndexes(function(err){
				if(err)
				{
					console.log('Impossibile creare l\'indice');
					callback(false);
				}else{
					//indice creato correttamente
					callback(true);
				}
			});
			
		}else{
			callback(false);
		}
	});
}

exports.deleteIndex = function(db, indexName, collectionName, callback) {

	var collection = db.collection(collectionName);
	
	collection.dropIndex(indexName, function(err, result){
		if(err)
		{
			callback(false);
		}else{
			callback(true);
		}	
	});	
	
}
