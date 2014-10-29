var app = angular.module('app')
app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, $rootScope, $stateParams) {

    $scope.ProjectUID = $stateParams.ProjectUID;
    $scope.onSwipeRight = function () {
        alert('swiped right')
    }
    $rootScope.menuStatus = true;


   

})