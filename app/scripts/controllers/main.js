'use strict';

/**
 * @ngdoc function
 * @name rosieApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rosieApp
 */
angular.module('rosieApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
