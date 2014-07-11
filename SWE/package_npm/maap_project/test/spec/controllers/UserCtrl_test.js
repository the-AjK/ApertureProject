/**
 * File: UsersCtrl_test;
 * Module: test;
 * Author: jack;
 * Created: 10/05/14;
 * Version: versione corrente;
 * Description: descrizione dettagliata del file;
 * Modification History: tabella dei cambiamenti effettuati sul file.
 */
'use strict';

describe('UsersCtrl', function () {

    var UsersCtrl,
        routeParams,
        scope,
        $httpBackend,
        mockUserResource;
    
    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller'),
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        mockUserResource = $injector.get('UserDataService');
        scope = $rootScope.$new();
        routeParams = {};
        routeParams.user_id = 0;

        UsersCtrl = $controller('UsersCtrl', {
            '$scope': scope,
            '$routeParams': routeParams,
            'UserDataService': mockUserResource
        });
    }));


    describe('get the right list', function () {
        it('should initialize data correctly', function () {
            expect(scope.original_data.length).toBe(0);
            expect(scope.original_keys.length).toBe(0);
            expect(scope.current_document).toBe(0);

        });

    });

    describe('get the right list', function () {
        it('should call getUser with username', inject(function () {
            $httpBackend.expectGET('http://localhost:9000/api/users/:user_id')
                .respond({labels:['a','b','c'],
                    values: [1,2,3]});

            var result = mockUserResource.get();

            $httpBackend.flush();

            expect(result.labels[0]).toBe('a');
            expect(result.values[1]).toBe(2);
        }));

    });

});