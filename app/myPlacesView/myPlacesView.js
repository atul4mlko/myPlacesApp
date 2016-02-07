'use strict';

angular.module('myApp.myPlacesView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/myPlacesView', {
    templateUrl: 'myPlacesView/myPlacesView.html',
    controller: 'MyPlacesViewCtrl'
  });
}])

.controller('MyPlacesViewCtrl', ['$scope', 'MyPlacesService', 'localStorageService', function($scope, MyPlacesService, localStorageService) {
  $scope.savedPlaces = MyPlacesService.getMySavedPlaces();
  $scope.localStorageKey = "places";

  $scope.removeFromMyPlaces = function(place) {
    MyPlacesService.removePlace(place);
  }

  $scope.getCount = function(n){
     return new Array(n);
  }
  
}]);
