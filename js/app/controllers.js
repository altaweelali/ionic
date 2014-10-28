var app = angular.module('app')
app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state) {

    $scope.test = 'test var';
    $scope.onSwipeRight = function () {
        alert('swiped right')
    }
    $scope.enableMenu = true;


   

})