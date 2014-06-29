/**
 * File: CollectionListService;
 * Module: services;
 * Author: Giacomo Pinato;
 * Created: 01/06/14;
 * Version: versione corrente;
 * Description: Factory that returns a $resource
 * 	bounded to the list of avaliable Collections;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */
'use strict';

angular.module('services')
    .factory('CollectionListService', ['$resource', function ($resource) {
		
		//DO NOT EDIT THE NEXT LINE - Maaperture server will update the var hostURL value
		//using the configuration file's settings everytime the server will start up.
		var hostURL = 'maapertureServerWillWriteHere';
		
        return $resource( hostURL + '/api/collection/list');

    }]);




