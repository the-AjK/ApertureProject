var provaquery = function query(model, criteria, newvaluefield,callback){
	var options = {};
	//options. = true;
	
	var query = model.update(criteria, {$set:newvaluefield}, options);
	query.lean().exec( function(err, count){
		if(err){console.log('query utenti fallita'); return;}
		if(count==0){
		console.log('nessun risultato'); 
		//console.log('count:'+count);
		}else{
			var result = model.find(criteria);
			result.lean().exec( function(err, ris){
				if(err){console.log('query find utenti fallita'); return;}
				if(!ris){
					console.log('nessun risultato');
				}
				else{
					callback(ris);
				}
			});
		}//else
		});
}
exports.provaquery = provaquery;