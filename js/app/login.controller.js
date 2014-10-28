var app = angular.module('app')
app.controller('loginCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state) {

    $scope.loginInfo = {};
    $scope.loginInfo.url;
    $scope.loginInfo.username;
    $scope.loginInfo.password;
    $scope.loginInfo.rememberMe = true;

    $scope.doLogin = function () {
        
        //TODO: Add Form Validation before sending the vars to the login provider

        auth.login($scope.loginInfo.username, $scope.loginInfo.password, $scope.loginInfo.url, $scope.loginInfo.rememberMe)
    }
  
})