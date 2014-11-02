/// <reference path="../../../lib/ionic/js/angular/angular.js" />
var app = angular.module('app')
app.controller('summaryCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext, $rootScope) {

    var width = $(document).width() * 0.70;
    $scope.pieOptions = {
        animate: {
            duration: 1000,
            enabled: true
        },
        size: width,
        barColor: '#2b6b90',
        scaleColor: false,
        lineWidth: 14,
        // lineCap: 'circle'
    };

    $scope.percentComplete = 75;
})