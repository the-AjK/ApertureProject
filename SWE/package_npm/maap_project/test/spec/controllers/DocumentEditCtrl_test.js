/**
 * File: DocumentEditCtrl_test;
 * Module: modulo di appartenenza;
 * Author: jack;
 * Created: 16/05/14;
 * Version: versione corrente;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */

'use strict';

describe('Controller: DocumentEditCtrl', function () {

    // load the controller's module
    beforeEach(module('maaperture'));

    var MainCtrl,
        routeParams,
        MockDocService,

        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope ) {
        scope = $rootScope.$new();
        routeParams ={};
        routeParams.col_id=0;
        routeParams.doc_id=0;

        MockDocService = {
            query: function() {
                return {

                    "customer": "Snoop Dogg",
                    "Address": "Bitches boulevard, swagtown",
                    "Sex": "All the time",
                    "email": "snoop@dogg.ganja",
                    "date": "15/12/2015",
                    "Something": "something else"
                }

            },
            update: function(value) {

                return value;
            }
        };



        MainCtrl = $controller('DocumentEditCtrl', {
            $scope: scope,
            $routeParams:routeParams,
            DocumentDataService : MockDocService
        });
    }));

    it('should not have an empty scope', function(){
        expect(scope).not.to.equal([]);
    });


    it('should return the correct answer', function(){
        scope.data = MockDocService.query();
        expect(scope.data).to.deep.equal({

            "customer": "Snoop Dogg",
            "Address": "Bitches boulevard, swagtown",
            "Sex": "All the time",
            "email": "snoop@dogg.ganja",
            "date": "15/12/2015",
            "Something": "something else"
        });

    });



    it('should send the correct data to update', function(){
       

    });

});
