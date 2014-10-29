/// <reference path="../../../lib/ionic/js/angular/angular.js" />
var app = angular.module('app')
app.controller('projectsCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext, $rootScope) {

    $scope.projectListArr = [];
    var projectUids = $rootScope.projects.getAuhorizedProjectList();

    
    var select = "ProjectId,\
    ProjectName,\
    ProjectFinishDate,\
    ProjectStartDate,\
    ProjectOwnerName,\
    ProjectPercentCompleted";

    $scope.getProjects = function () {
        angular.forEach(projectUids, function (uid) {


            var query = new breeze.EntityQuery()
            .from('Projects')
            .where('ProjectId', '==', uid)
            .select(select);

            datacontext.get('Projects', query).done(ready).fail(fail)
        });

    }

    $scope.getProjects();

    $scope.onRefresh = function () {
        $scope.projectListArr = [];
        $scope.getProjects()
        
    }
    var index = 0;
    var callLength = projectUids.length;
    function ready(data) {
        index = index + 1;
        $scope.projectListArr.push.apply($scope.projectListArr, data)
        
        if (index > callLength -1) {

            $rootScope.projects.projectList = $scope.projectListArr;
            $scope.$broadcast('scroll.refreshComplete');
        }

    }

   
    function fail(error) {
    }

})