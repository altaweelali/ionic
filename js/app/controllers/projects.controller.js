/// <reference path="../../../lib/ionic/js/angular/angular.js" />
var app = angular.module('app')
app.controller('projectsCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext, $rootScope) {

    if (!$rootScope.isLoggedIn) {
        $state.go('home.login')
    }

    // globa variables

    $scope.query;

    $scope.loading = true;


    var projectListArr = [];

    try {
        var projectUids = $rootScope.projects.getAuhorizedProjectList();
    } catch (e) {
        $state.go('home.login')
    }
    

    
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

    if ($rootScope.projectsLoaded) {
        $scope.projectList = $rootScope.projects.getProjectList();
        //$scope.$broadcast('scroll.refreshComplete');
        $scope.loading = false;
    } else {
        $scope.getProjects();
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
            $rootScope.projectsLoaded = true;
        }

    }

   
    function fail(error) {
    }


    $scope.onRefresh = function () {
        $scope.loading = true;
        $scope.projectList = [];
        projectListArr = [];
        $scope.getProjects()

    }

    $scope.goToSummary = function (ID) {

        $rootScope.currentProjectID = ID;
        $state.go('app.summary')

    }

})