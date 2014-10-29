/// <reference path="../../../lib/ionic/js/angular/angular.js" />
var app = angular.module('app')
app.controller('projectsCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext, $rootScope) {


    // globa variables

    $scope.query;

    $scope.loading = true;
    $scope.projectList = [];
    var projectListArr = [];
    var projectUids = $rootScope.projects.getAuhorizedProjectList();

    
    var select = "ProjectId,\
    ProjectName,\
    ProjectFinishDate,\
    ProjectStartDate,\
    ProjectOwnerName,\
ProjectCost,\
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
        $scope.loading = true;
        $scope.projectList = [];
        projectListArr = [];
        $scope.getProjects()
        
    }
    var index = 0;
    var callLength = projectUids.length;
    function ready(data) {
        index = index + 1;
        projectListArr.push.apply(projectListArr, data)
        
        if (index > callLength -1) {

            $rootScope.projects.projectList = projectListArr;
            $scope.projectList = $rootScope.projects.getProjectList();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loading = false;
        }

    }

   
    function fail(error) {
    }

})