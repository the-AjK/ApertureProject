/**
 * File: DSLManager.js
 * Module: maap_server::modelServer::DSL
 * Author: Alberto Garbui
 * Created: 10/05/14
 * Version: 0.1
 * Description: gestione file dsl
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

//DSL manager
// controlla la presenza di file dsl nell'apposita cartella definita
//nel file di configurazione e cerca di eseguire il parser di ogni file
// utilizzando DSLParser.js che controlla la correttezza dei campi dati 
// del dsl.

var fs = require('fs'); 
var path = require('path'); 
var DSLparser = require('./DSLParser');
var schemaGenerator = require('./schemaGenerator');

var generateFunction = function(transformation) {

	//eseguo lo split del name per vedere se ci sono nomi composti
	var name = transformation.name.split('.');
	if(name.length>1) transformation.name = name[1];
	
	var result = '//maaperture auto-generated function for item \'' + transformation.name + '\':\n\n'
	result += 'exports.transformation = function(' + transformation.name + ') {\n';
	result += transformation.transformation + '\n';
	result += 'return ' + transformation.name + ';\n}';
	return result;
}
//for unit test
exports.generateFunction = generateFunction;

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        if (curPath.indexOf('DUMMYFILE') == -1) 
			fs.unlinkSync(curPath);
      }
    });
	//evito di eliminare la directory
    //fs.rmdirSync(path);
  }
};

//salva un file nella path indicata
var saveFile = function(buffer, fileName, filePath) {
	
	var fullPath = filePath + '/' + fileName;
	
	console.log('saving ' + fileName);
		
	fs.writeFileSync(fullPath, buffer, 'utf-8', function (err) {
			if (err) {
				console.error('error writing file: ' + fullPath);
				throw err;
			} 
		}
	);	
}

var checkDSL = function(app) {

	var config = app.config;
	
	//eseguo la pulizia della cartella collectionData
	//dai files json ed i modelli
	var collectionDataPath = __dirname + '/collectionData';
	var list = fs.readdirSync(collectionDataPath);
	if(list.length > 0)
	{
		if(config.app.env == 'development')
			console.log('cleaning up collectionData files...');
		deleteFolderRecursive(collectionDataPath);
	}
			
	//carica ogni file dsl e genera il file json dopo opportuni controlli
	var collectionsList = [];
	var results = [];
    var list = fs.readdirSync(config.static_assets.dsl);
    list.forEach(function(file) {
		
        var filePath = config.static_assets.dsl + '/' + file;
        var stat = fs.statSync(filePath);
		var extension = path.extname(file);
        if (stat && stat.isFile() && extension == '.maap') {
			results.push(filePath);
			
			if(config.app.env == 'development')
			{
				console.log('found dsl: ' + file);			
				console.log('parsing ' + file + '...');
			}
			
			//provo a leggere il dsl
			try{
				var DSL = require(filePath);
			}catch(err){
				console.error('parsing error!');
				console.error('check your dsl file syntax: ' + file);
				throw err;
			}
			
			//ora uso DSLParser per controllare la correttezza dei dati nel DSL:
			var result = DSLparser.parseDSL(DSL);
					
			//carico il nome del file
			var filename = result.collection.name;
			var collectionLabel = result.collection.label;
			var collectionPosition = result.collection.position;
					
			//se corretto mi ritorna un JSON con tutti i campi dati corretti
			if(config.app.env == 'development')
				console.log('errors checking...');
			
			//test se il risultato � in formato JSON
			var stringResult = JSON.stringify(result, null, '\t');
			try {
				var risultatoJSON = JSON.parse(stringResult);
			} catch(err) {
				console.error('parsing result error! [invalid_JSON]');
				console.error('check maaperture dsl parser: DSLParser.js');
				throw err; 
			}
					
			//salvo su file
			saveFile(	stringResult,					//contenuto
						filename + '.json',				//nome file
						__dirname + '/collectionData'	//path del file
					);
						
			//genero i file delle funzioni/trasformazioni
			var transformations = DSLparser.transformations;
			var index = transformations.index;
			var show = transformations.show;
			
			for(var j=0; j<index.length; j++)
			{
				var name = 'transformation_' + filename + '_index_' + index[j].name + '.js'; 
			
				//salvo su file
				saveFile(	generateFunction(index[j]),		//contenuto
							name,							//nome file
							__dirname + '/collectionData'	//path del file
						);
			}
						
			for(var j=0; j<show.length; j++)
			{
				
				var name = 'transformation_' + filename + '_show_' + show[j].name + '.js';
				
				//salvo su file
				saveFile(	generateFunction(show[j]),		//contenuto
							name,							//nome file
							__dirname + '/collectionData'	//path del file
						);
			}
						
			//genero lo schema se necessario
			try{
				var schema = require('./collectionData/' + filename + '_schema.js');
			}catch(err){
			
				if(config.app.env == 'development')
					console.log('DSL manager: missing ' + filename + '_schema.js');
				
				//qui non trovo lo schema, quindi lo creo
				var schema = schemaGenerator.generate(app.config, result);
				
				//salvo su file
				saveFile(	schema,							//contenuto
							filename + '_schema.js',		//nome file
							__dirname + '/collectionData'	//path del file
						);
	
			}
			
			//aggiungo la lista di collections
			var collectionInfo = {};
			collectionInfo.label = collectionLabel;
			collectionInfo.name = filename;
			collectionInfo.position = collectionPosition;
			collectionInfo.dsl_file = __dirname + '/collectionData/' + filename + '.json';
			collectionInfo.schema_file = __dirname + '/collectionData/' + filename + '_schema.js';
			collectionsList.push(collectionInfo);
					
		}//end if is file con estensione .maap		
    }); //end for each
	
	//ordino la lista delle collections
	collectionsList.sort(function(a, b){
		return a.position - b.position;
	});
	
	//salvo su file la lista di collections in formato json
	var stringResult = JSON.stringify(collectionsList, null, '\t');
	
	//salvo su file
	saveFile(	stringResult,					//contenuto
				'collectionsList.json',			//nome file
				__dirname + '/collectionData'	//path del file
			);

};

exports.checkDSL = checkDSL;
