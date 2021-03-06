﻿var app = angular.module('app')
app.controller('loginCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext) {

    var storedCredentials = auth.getCredentials();

    $scope.loginInfo = {};
    $scope.loginInfo.url = storedCredentials.url;
    $scope.loginInfo.username = storedCredentials.username;
    $scope.loginInfo.password = storedCredentials.password;
    $scope.loginInfo.rememberMe = true;

    $scope.doLogin = function () {
        
        //TODO: Add Form Validation before sending the vars to the login provider

        var promise = auth.login($scope.loginInfo.username, $scope.loginInfo.password, $scope.loginInfo.url, $scope.loginInfo.rememberMe);

        promise.then(success, failure);

        function success(response) {


            //$state.go('app.projects')

            datacontext.getCustomFields().done(function (data) {
                alert(data[0].Name)
            })
        }

        function failure(respose) {
            alert('try again')
        }

    }
  
})