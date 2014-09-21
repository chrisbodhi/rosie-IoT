'use strict';

/**
 * @ngdoc function
 * @name rosieApp.controller:MainCtrl
 * @description
 * # HistoryCtrl
 * Controller of the rosieApp
 */
angular.module('rosieApp')
  .controller('HistoryCtrl', function ($scope) {

    $scope.options = {
      stacks: [{axis: 'y', series: ['fat', 'pro', 'carbs']}],
      lineMode: 'cardinal',
      series: [
        {
          id: 'fat',
          y: 'fat',
          label: 'Fat',
          type: 'column',
          color: '#1f77b4',
          axis: 'y'
        },
        {
          id: 'pro',
          y: 'protein',
          label: 'Protein',
          type: 'column',
          color: '#ff7f0e',
          axis: 'y'
        },
        {
          id: 'carbs',
          y: 'carbs',
          label: 'Carbs',
          type: 'column',
          color: '#d62728',
          axis: 'y'
        }
      ],
      axes: {x: {type: 'linear', key: 'x'}, y: {type: 'linear'}},
      tension: 0.7,
      tooltip: {mode: 'scrubber'},
      drawLegend: true,
      drawDots: true,
      columnsHGap: 5
    };

    $scope.data = [
      {
        x: 0,
        fat: 0,
        protein: 0,
        carbs: 0,
        weight: 0
      }]

    
    $scope.data = [
      { 
        x: 0, 
        weight: 100, 
        fat: 9, 
        protein: 21, 
        carbs: 0
        // calories: 172, 
        // name: 'Chicken Breast'
      },

      { 
        x: 2, 
        weight: 148, 
        fat: 0.6, 
        protein: 4.2,
        carbs: 10
        // calories: 50, 
        // name: 'Broccoli'
      },
      { 
        x: 3, 
        weight: 242, 
        fat: 7, 
        protein: 4,
        carbs: 35
        // calories: 214, 
        // name: 'Mashed Potatoes'
      },
      { 
        x: 4, 
        weight: 238, 
        fat: 14, 
        protein: 4.6,
        carbs: 13
        // calories: 188, 
        // name: 'Gravy, Chicken'
      },
      { 
        x: 5, 
        weight: 66, 
        fat: 7, 
        protein: 2.3,
        carbs: 16
        // calories: 137, 
        // name: 'Vanilla Ice Cream
      }
    ];


  });
