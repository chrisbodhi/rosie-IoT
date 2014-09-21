'use strict';

/**
 * @ngdoc function
 * @name rosieApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the rosieApp
 */
angular.module('rosieApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
