'use strict';

angular.module('myApp.searchView', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/searchView', {
    templateUrl: 'searchView/searchView.html',
    controller: 'SearchViewCtrl'
  });
}])

.controller('SearchViewCtrl', ['$scope', 'Map', 'MyPlacesService', 'localStorageService',
          function($scope, Map, MyPlacesService, localStorageService) {
  $scope.searchResults = [];
  $scope.place = {};

  $scope.isPlaceAlreadySaved = function(place) {
    return MyPlacesService.isPlaceAlreadySaved(place);
  }

  $scope.search = function() {
      $scope.apiError = false;
      Map.search($scope.searchPlace)
      .then(
          function(res) { // success
              console.log(res)
              $scope.searchResults = res;
              for (var i = 0; i < res.length; i++) {
                var place = res[i];
                Map.createMarker(res[i]);
              }
              //Map.addMarker(res);
              //$scope.place.name = res.name;
              //$scope.place.lat = res.geometry.location.lat();
              //$scope.place.lng = res.geometry.location.lng();
          },
          function(status) { // error
              $scope.apiError = true;
              $scope.apiStatus = status;
          }
      );
  }

  $scope.send = function() {
      alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);
  }

  $scope.getCount = function(n){
     return new Array(n);
  }

  $scope.addToMyPlaces = function(place) {
   MyPlacesService.addPlace(place);
  }

  $scope.removeFromMyPlaces = function(place) {
   MyPlacesService.removePlace(place);
  }

  $scope.animateMarker = function(index) {
    Map.animateMarker(index);
  }

  Map.init();
}]);
