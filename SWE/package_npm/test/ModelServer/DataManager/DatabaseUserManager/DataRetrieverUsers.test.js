/**
 * File: DataRetrieverUsers.test.js
 * Module: test::ModelServer::DataManager::DatabaseUserManager
 * Author: Alberto Garbui
 * Created: 20/06/14
 * Version: 1.0
 * Description: test del DataRetrieverUsers
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 1.0 File creation
 ==============================================
 */
 
var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
var expect = chai.expect;
var rewire = require('rewire');

var retriever = rewire("../../../../maap_server/modelServer/dataManager/DatabaseUserManager/DataRetrieverUsers.js");

describe("DataRetrieverUsers Unit Test: ", function() {

	describe("Test addUser:", function() {
		
		/*it("inserimento utente deve essere eseguito con successo", function(done) {
			
			retriever.__set__('addUser.criteria', function(callback){callback(true);} );
			
			retriever.addUser('email','password',0,function(done){
				expect(done).to.equal(true);
			});
		
		});*/
		
	});

	describe("Test getUserProfile:", function() {

		it("getUserProfile deve restituire un errore ed un oggetto vuoto se il recupero dal DB genera un errore", function(done) {
		
			retriever.__set__('DB', {users: {findOne: function(obj, callback){callback('testError',{user: 'testUser'});}}} );

			retriever.getUserProfile('iduser',function(result){
				expect(result.user).to.equal(undefined);
				done();
			});
			
		});
		
		it("getUserProfile deve restituire un oggetto vuoto se il recupero ha successo ma l'utente non e' presente nel DB", function(done) {
		
			retriever.__set__('DB', {users: {findOne: function(obj, callback){callback(false, false);}}} );

			retriever.getUserProfile('iduser',function(result){
				expect(result.user).to.equal(undefined);
				done();
			});
			
		});
			
		it("getUserProfile deve restituire l'utente corretto se il recupero dal DB ha successo", function(done) {
		
			retriever.__set__('DB', {users: {findOne: function(obj, callback){callback(false, {user: 'testUser'});}}} );

			retriever.getUserProfile('iduser',function(result){
				expect(result.user).to.equal('testUser');
				done();
			});
			
		});

	});

	describe("Test updateUserProfile:", function() {

		it("updateUserProfile deve ritornare false se c'e' un errore con il DB", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback('DBerror', 0);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				email: 'test@mail.it',
				newpassword: 'newPass' 
			},
				session: {
					passport: {
						user: {
							_id: 123,
							password: 'oldPassword'
						}
					}
				}		
			};
			
			retriever.updateUserProfile(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUserProfile deve ritornare false se l'update non ha successo", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 0);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				email: 'test@mail.it',
				newpassword: 'newPass' 
			},
				session: {
					passport: {
						user: {
							_id: 123,
							password: 'oldPassword'
						}
					}
				}		
			};
			
			retriever.updateUserProfile(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUserProfile deve ritornare true se l'update avviene corrattamente", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 1);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				email: 'test@mail.it',
				newpassword: 'newPass' 
			},
				session: {
					passport: {
						user: {
							_id: 123,
							password: 'oldPassword'
						}
					}
				}		
			};
			
			retriever.updateUserProfile(req, function(result){
				expect(result).to.equal(true);
			});	
			
		});

	});

	describe("Test getUsersList:", function() {

	/*
		it("getUsersList ", function() {
			retriever.__set__('DB', {	
			users: {
						find: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 1);} }
												}
											}
								}
					}
			
			});
			
			var column = ;
			var order = ;
			var page = ;
			var perpage = ;
			
			retriever.getUsersList(column, order, page, perpage, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		*/

	});

	describe("Test updateUser:", function() {

		it("updateUser deve restituire false se il livello utente non e' valido", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 1);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'fakeLevel' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUser deve restituire false per l'utente base se e' presente un errore", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback('testError', 0);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'user' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUser deve restituire false per l'utente base se l'update non ha successo", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 0);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'user' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUser deve restituire true per l'utente base se l'update ha successo", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 1);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'user' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(true);
			});	
			
		});
		
		it("updateUser deve restituire false per l'utente administrator se e' presente un errore", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback('testError', 0);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'administrator' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUser deve restituire false per l'utente administrator se l'update non ha successo", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 0);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'administrator' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(false);
			});	
			
		});
		
		it("updateUser deve restituire true per l'utente administrator se l'update ha successo", function() {
			retriever.__set__('DB', {	
			users: {
						update: function(criteria, data, options){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 1);} }
												}
											}
								}
					}
			
			});
			
			var req = {body: {
				id: 123,
				email: 'test@mail.it',
				level: 'administrator' 
			}};
			
			retriever.updateUser(req, function(result){
				expect(result).to.equal(true);
			});	
			
		});


	});

	describe("Test removeUser:", function() {

		it("removeUser deve restituire true se la rimozione ha avuto successo", function() {
			retriever.__set__('DB', {	
			users: {
						remove: function(criteria){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 1);} }
												}
											}
								}
					}
			
			});
			retriever.removeUser('iduser',function(result){
				expect(result).to.equal(true);
			});		
		});
		
		it("removeUser deve restituire false se la rimozione non ha avuto successo", function() {
			retriever.__set__('DB', {	
			users: {
						remove: function(criteria){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback('testError', 0);} }
												}
											}
								}
					}
			
			});
			retriever.removeUser('iduser',function(result){
				expect(result).to.equal(false);
			});		
		});
		
		it("removeUser deve restituire false se l'utente non e' presente nel DB", function() {
			retriever.__set__('DB', {	
			users: {
						remove: function(criteria){
						
									return {		
												lean: function(){
														return { exec: function(callback){callback(false, 0);} }
												}
											}
								}
					}
			
			});
			retriever.removeUser('iduser',function(result){
				expect(result).to.equal(false);
			});		
		});
		
	});
	
}); //end Unit Test DataRetrieverUsers
