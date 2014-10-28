// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "pages/menu.html",
          controller: 'AppCtrl'
      })

      .state('app.login', {
          url: "/login",
          views: {
              'menuContent': {
                  templateUrl: "pages/login.html",
                  controller: 'loginCtrl'
              }
          }
      })

      .state('app.settings', {
          url: "/settings",
          views: {
              'menuContent': {
                  templateUrl: "pages/settings.html",
                  controller: 'AppCtrl'
              }
          }
      })
        .state('app.projects', {
            url: "/projects",
            views: {
                'menuContent': {
                    templateUrl: "pages/projects.html",
                    controller: 'AppCtrl'
                }
            }
        })
      .state('app.summary', {
          url: "/summary",
          views: {
              'menuContent': {
                  templateUrl: "pages/summary.html",
                  controller: 'AppCtrl'
                  
              }
          }
      })

      .state('app.work', {
          url: "/work",
          views: {
              'menuContent': {
                  templateUrl: "pages/work.html",
                  controller: 'AppCtrl'
                  
              }
          }
      })
    .state('app.cost', {
        url: "/cost",
        views: {
            'menuContent': {
                templateUrl: "pages/cost.html",
                controller: 'AppCtrl'
               
            }
        }
    })
    .state('app.team', {
        url: "/team",
        views: {
            'menuContent': {
                templateUrl: "pages/team.html",
                controller: 'AppCtrl'
                
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});