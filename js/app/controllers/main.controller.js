var app = angular.module('app')
app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, $rootScope, $stateParams) {

    $scope.ProjectUID = $rootScope.currentProjectID;
    $scope.menuStatus = $rootScope.isLoggedIn;
    if (!$rootScope.isLoggedIn) {
        $state.go('home.login')
    } 
    $scope.onSwipeRight = function () {
        alert('swiped right')
    }
    $rootScope.menuStatus = true;

    $scope.$on('loggedIn', function () {
        $scope.menuStatus = $rootScope.isLoggedIn;
    })
})