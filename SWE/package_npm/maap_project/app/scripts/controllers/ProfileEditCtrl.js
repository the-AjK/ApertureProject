/**
 * File: ProfileEditCtrl;
 * Module: mapp:controllers;
 * Author: Giacomo Pinato;
 * Created: 12/05/14;
 * Version: versione corrente;
 * Description: descrizione dettagliata del file;
 * Modification History:
 ==============================================
 * Version | Changes
 ==============================================
 * 0.1 File creation
 ==============================================
 */

'use strict';
angular.module('maaperture').controller('ProfileEditCtrl', function ($scope, $location, ProfileEditService) {

    $scope.original_data = [];
    $scope.original_keys = [];

    //Funzione per richiedere un profilo al server.
    ProfileEditService.query({
           },
        function success(data) {
            $scope.labels = data.label;
            $scope.data = data.data;
            //inizializza un array con le chiavi originali e un array con i valori originali da modificare
            $.each($scope.data, function (key, value) {
                $scope.original_keys.push(key);
                $scope.original_data.push(value);
            });
        },
        function err(error) {
            $location.path("/404");

        }
    );

    //Funzione per inviare al server il nuovo profilo
    $scope.edit_document = function () {
        var new_data = {};
        //Assembla il json da trasmettere.
        for (var i = 0; i < $scope.labels.length; i++) {
            new_data[$scope.original_keys[i]] = $scope.original_data[i];
        }
        //trasforma l'oggetto new_data in JSON.
        var json_data = JSON.stringify(new_data);
        //Trasmette al server il nuovo json
        ProfileEditService.update({

            },
            json_data,
            function success() {
                $location.path('/collection/' + $scope.current_collection + '/' + $scope.current_document);
            },
            function err(error) {
                $location.path("/404");

            }
        );
    };
    //Funzione per richiedere la cancellazione del profilo
    $scope.delete_document = function () {
        ProfileEditService.remove({

            },

            function success() {
                $location.path('/collection/' + $scope.current_collection);
            },
            function err(error) {
            }
        );
    };
});
