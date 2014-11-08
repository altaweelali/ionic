/// <reference path="../../../lib/ionic/js/angular/angular.js" />
var app = angular.module('app')
app.controller('summaryCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext, $rootScope, $ionicScrollDelegate) {
    var width = $(document).width() * 0.70;
    var height = $(window).height();

    $scope.pieOptions = {
        animate: {
            duration: 1500,
            enabled: true
        },
        onStep: function(from, to, percent) {
            this.el.children[0].innerHTML = Math.round(percent);
        },
        size: width,
        barColor: '#2b6b90',
        scaleColor: false,
        lineWidth: 14,
        // lineCap: 'circle'
    };

    $scope.percentComplete = 75;

    $scope.renderBarChart = function (args) {
        $('#tasks-status-chart').highcharts({
            chart: {
                type: 'column',
                
                height: 200
            },
            title: {
                text: ''
            },

            credits: {
                enabled: false
            },
            legend: {
                enabled: false,
                itemStyle: {
                    color: '#000000',
                    fontWeight: '100',
                    "text-transform": 'uppercase',
                }
            },

            tooltip: {
                shared: true
            },

            yAxis: {
              
                gridLineDashStyle: 'dash',
                gridLineColor: '#fff',
                title: {
                    text: ''
                },
                labels: {
                    enabled: false,
                    style: {
                        color: '#F78181'
                    }
                }
            },
            xAxis: {
                categories: [
                 'Complete',
                 'In-progress',
                 'Remaining'

                ]
            },
            plotOptions: {
                series: {
                    
                    shadow: false,
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: true,
                        color: '#A34775',
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                name: 'Tasks Status',
                data: [
                    { name: 'Complete', y: 100, color: '#4D94B8' },
                    { name: 'In-progress', y: 50, color: '#70B894' },
                    { name: 'Remaining', y: 200, color: '#DB4D4D' },

                ]
            }]
        });
    }


    $scope.renderBarChart();

   
  
})