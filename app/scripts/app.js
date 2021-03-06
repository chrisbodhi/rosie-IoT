'use strict';

/**
 * @ngdoc overview
 * @name rosieApp
 * @description
 * # rosieApp
 *
 * Main module of the application.
 */
angular
  .module('rosieApp', [
    'n3-line-chart',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .controller('IndexCtrl', function ($scope){
      $scope.toggleActive = function(){
        
      };
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
