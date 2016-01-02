// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ngCordova', 'firebase', 'ionic', 'Myservices', 'starter.controllers', 'nvd3'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider



    .state('login', {
    url: '/login',
        views:{
          'mainView':{
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }

        }

  })


      .state('register', {
          url: '/register',
          views:{
              'mainView':{
                  templateUrl: 'templates/register.html',
                  controller: 'RegistrationCtrl'

              }

          }

      })



      .state('app', {
          url: '/app',
          views:{
              'mainView':{
                  templateUrl: 'templates/sidemenu.html',
                  controller: 'FeaturesCtrl'

              }

          }

      })



      .state('app.tracker', {
        url: '/tracker',
        views: {
          'menuContent': {
            templateUrl: 'templates/tracker.html'
          }
        }
      })

      .state('app.trackerPie', {
          url: '/tracker/pieChart',
          views: {
              'menuContent': {
                  templateUrl: 'templates/tracker-Pie.html'
              }
          }
      })

      .state('app.budgetEntry', {
        url: '/budgetEntry',
        views: {
          'menuContent': {
            templateUrl: 'templates/budgetEntry.html'
          }
        }
      })


    // Each tab has its own nav history stack:

      .state('app.budgetEntry.term', {
        url: '/term',
        views: {
          'budgetEntry-term': {
            templateUrl: 'templates/budgetEntry-Term.html'
          }
        }
      })


      .state('app.budgetEntry.termAdd', {
          url: '/term/add',
          views: {
              'budgetEntry-term': {
                  templateUrl: 'templates/budgetEntry-TermAdd.html'
              }
          }
      })


      .state('app.budgetEntry.termEdit', {
        url: '/term/edit',
        views: {
          'budgetEntry-term': {
            templateUrl: 'templates/budgetEntry-TermEdit.html'
          }
        }
      })


      .state('app.budgetEntry.income', {
        url: '/income',
        views: {
          'budgetEntry-income': {
            templateUrl: 'templates/budgetEntry-Income.html'
          }
        }
      })

      .state('app.budgetEntry.incomeEdit', {
        url: '/incomeEdit',
        views: {
          'budgetEntry-income': {
            templateUrl: 'templates/budgetEntry-IncomeEdit.html'
          }
        }
      })

      .state('app.budgetEntry.expenses', {
        url: '/expenses',
        views: {
          'budgetEntry-expenses': {
            templateUrl: 'templates/budgetEntry-Expenses.html'
          }
        }
      })



      .state('app.budgetEntry.expensesEdit', {
          url: '/expensesEdit',
          views: {
              'budgetEntry-expenses': {
                  templateUrl: 'templates/budgetEntry-ExpensesEdit.html'
              }
          }
      })

      .state('app.comparison', {
          url: '/comparison',
          views: {
            'menuContent': {
              templateUrl: 'templates/comparison.html'
            }
          }
        })


      .state('app.comparisonBar', {
          url: '/comparison/BarGraph',
          views: {
              'menuContent': {
                  templateUrl: 'templates/comparisonBar.html'
              }
          }
      })


      .state('app.tips', {
      url: '/tips',
      views: {
        'menuContent': {
          templateUrl: 'templates/tips.html',
          controller: 'TipsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
