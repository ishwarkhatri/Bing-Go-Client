var app = angular.module('myApp', ['ngRoute']);

app.config('$routeProvider', function($routeProvider){
    $routeProvider
		.when('/home',{
			templateUrl: 'view/home.html',
			controller: 'myCtrl'
		})
		.when('/events', {
			templateUrl: 'view/events.html',
			controller: 'eventCtrl'
		})
        .otherwise(
            { redirectTo: '/'}
        );
});