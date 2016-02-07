'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.searchView',
  'myApp.myPlacesView',
  'LocalStorageModule'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/searchView'});
}])
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('MySavedPlaces')
    .setNotify(true, true)
})
.service('MyPlacesService', function(localStorageService){
  this.addPlace = function(place) {
    var isPlaceAlreadySaved = this.isPlaceAlreadySaved(place);
    if (!isPlaceAlreadySaved) {
      this.mySavedPlaces.push(place);
      var key = "MySavedPlaces." + this.localStorageKey;
      localStorageService.set(key, this.mySavedPlaces);
    }
  }

  this.removePlace = function(place) {
    for (var i = 0; i < this.mySavedPlaces.length; i++) {
      if (this.mySavedPlaces[i].id === place.id) {
        this.mySavedPlaces.splice(i, 1);
      }
    }
    var key = "MySavedPlaces." + this.localStorageKey;
    localStorageService.set(key, this.mySavedPlaces);
  }

  this.getMySavedPlaces = function() {
    this.mySavedPlaces = [];
    var key = "MySavedPlaces." + this.localStorageKey;
    if (localStorageService.get(key) !== null) {
      this.mySavedPlaces = localStorageService.get(key);
    }
    return this.mySavedPlaces;
  }

  this.isPlaceAlreadySaved = function(place) {
    this.getMySavedPlaces();
    for (var i = 0; i < this.mySavedPlaces.length; i++) {
      if (this.mySavedPlaces[i].id === place.id) {
        return true;
      }
    }
    return false;
  }

  this.mySavedPlaces = this.getMySavedPlaces();
  this.localStorageKey = "places";

})
.service('Map', function($q) {

    this.markers = [];

    this.init = function() {
        var options = {
            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
            zoom: 13,
            disableDefaultUI: true
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }

    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results);
            }
            else d.reject(status);
        });
        return d.promise;
    }

    this.animateMarker = function(index) {
      var circle ={
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'red',
          fillOpacity: .8,
          scale: 4.5,
          strokeColor: 'white',
          strokeWeight: 1
      };
      for (var i = 0; i < this.markers.length; i++) {
        if (index == i) {
          this.markers[i].setIcon("http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png");
        } else {
          this.markers[i].setIcon(circle);
        }
      }
    }

    this.createMarker = function(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location
      });
      this.map.setCenter(place.geometry.location);
      this.markers.push(marker);
    }

});
