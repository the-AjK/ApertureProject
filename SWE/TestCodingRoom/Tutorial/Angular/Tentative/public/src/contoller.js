// Create a module for our core AMail services
var aMailServices = angular.module('AMail', []);
// Set up our mappings between URLs, templates, and controllers
function emailRouteConfig($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            controller: ListController,
            templateUrl: 'list.html'
        }).
        when('/shop', {
            controller: ShoppingController,
            templateUrl: 'shop.html'
        }).
        when('/send', {
        controller: SenderController,
        templateUrl: 'form.html'
        }).
// Notice that for the detail view, we specify a parameterized URL component
// by placing a colon in front of the id
        when('/view/:id', {
            controller: DetailController,
            templateUrl: 'detail.html'
        }).
        otherwise({
            redirectTo: '/'
});
}
// Set up our route so the AMail service can find it
aMailServices.config(emailRouteConfig);
// Some fake emails
messages = [{
    id: 0, sender: 'jean@somecompany.com', subject: 'Hi there, old friend',
    date: 'Dec 7, 2013 12:32:00', recipients: ['greg@somecompany.com'],
    message: 'Hey, we should get together for lunch sometime and catch up.'
        +'There are many things we should collaborate on this year.'
}, {
    id: 1, sender: 'maria@somecompany.com',
    subject: 'Where did you leave my laptop?',
    date: 'Dec 7, 2013 8:15:12', recipients: ['greg@somecompany.com'],
    message: 'I thought you were going to put it in my desk drawer.'
        +'But it does not seem to be there.'
}, {
    id: 2, sender: 'bill@somecompany.com', subject: 'Lost python',
    date: 'Dec 6, 2013 20:35:02', recipients: ['greg@somecompany.com'],
    message: "Nobody panic, but my pet python is missing from her cage.She doesn't move too fast, so just call me if you see her."
} ];
// Get the message id from the route (parsed from the URL) and use it to
// find the right message object.
function DetailController($scope, $routeParams) {
    $scope.message = messages[$routeParams.id];

}
// Publish our messages for the list template
function ListController($scope) {
    $scope.messages = messages;
}

function SenderController($scope, $http) {
    $scope.message = 'Ammazzali tutti charlie';
    $scope.addUser = function () {

        var postData = {text:$scope.user.id};

// The next line gets appended to the URL as params
// so it would become a post request to /api/user?id=5

        $http.post('/addshop', postData
            ).success(function() {
                $scope.message = 'Thanks, ' + $scope.user.id + ', we added you!';
            }).error(function() {
                $scope.message = 'Sorry, ' + $scope.user.id + ', we fucked up!';
            });
        };
}

function ShoppingController($scope, $http) {
    $http.get('http://localhost:8080/req').success(function(data) {
        $scope.items = data;
    })};