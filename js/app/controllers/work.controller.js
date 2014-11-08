/// <reference path="../../../lib/ionic/js/angular/angular.js" />
var app = angular.module('app')
app.controller('workCtrl', function ($scope, $ionicModal, $timeout, $http, auth, $state, datacontext, $rootScope, $ionicScrollDelegate) {
    var width = $(document).width();
    var height = $(window).height();

    var today = new Date();


    $scope.renderBarChart = function (args) {
        $('#tasks-status-chart').highcharts({
            chart: {
                type: 'pie',

                height: 350
            },
            title: {
                text: ''
            },

            credits: {
                enabled: false
            },
            legend: {
                enabled: true,
                
                align: 'center',
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
               
                title: {
                    text: ''
                },
               
            },
            xAxis: {
                
            },
            plotOptions: {

                pie: {
                    showInLegend: true,
                    size: 250,
                    dataLabels: {
                        enabled: true,
                        format: '{y} Hr',
                        distance: -30,
                        color: 'white'
                    }
                },

                series: {

                    shadow: false,
                    marker: {
                        enabled: false
                    },
                    
                }
            },
            series: [{
                type: 'pie',
                name: 'Tasks Status',
                data: [
                    { name: 'Complete', y: 100, color: '#4D94B8' },
                    { name: 'In-progress', y: 50, color: '#70B894' },
                    { name: 'Remaining', y: 200, color: '#DB4D4D' },

                ]
            }]
        });
    }
    $scope.renderLineChart = function () {
        $('#work-line-chart').highcharts({

            chart: {
                
                width : width,
                height: 200
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true,

                align: 'center',
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                plotLines: [{
                    color: '#FA8258',
                    width: 1,
                    value: 106.5 ,//Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
                    label: {
                        text: 'YTD',
                        style: {
                            color: '#D8D8D8',
                                    
                        }
                    }
                },

                    {
                        color: '#81BEF7',
                        width: 1,
                        value: 95,//Date.UTC(today.getUTCFullYear()+1,0,1),
                        label: {
                            text: today.getFullYear() + 1,
                            style: {
                                color: '#D8D8D8',

                            }
                        }
                    }],
            },

            plotOptions: {
                series: {
                    marker: {
                        fillColor: '#FFFFFF',
                        lineWidth: 2,
                        lineColor: null // inherit from series
                    }
                }
            },

            series: [{
                name: 'Work',
                color: '#4D94B8' ,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            },
            {
                name: 'Actual',
                color: '#DB4D4D',
                data: [29.9, 71.5, 106.4, 133, 150, 180, 144, 155, 250, 260, 270, 288]
            }]
        });
    }

    $scope.renderBarChart();
    $scope.renderLineChart();


})