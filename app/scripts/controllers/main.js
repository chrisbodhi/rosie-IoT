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

    $scope.meals = [
      { name: 'Chicken Breast', weight: 100, calories: 172, protein: 21, carbs: 0, fat: 9},
      { name: 'Broccoli', weight: 148, calories: 50, protein: 4.2, carbs: 10, fat: 0.6},
      { name: 'Mashed Potatoes', weight: 242, calories: 214, protein: 4, carbs: 35, fat: 7},
      { name: 'Gravy, Chicken', weight: 238, calories: 188, protein: 4.6, carbs: 13, fat: 14},
      { name: 'Vanilla Ice Cream', weight: 66, calories: 137, protein: 2.3, carbs: 16, fat: 7}
    ];

  });
