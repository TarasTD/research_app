'use strict';

var API_URL = "http://ec2-52-28-120-4.eu-central-1.compute.amazonaws.com/";

angular.module('researchApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ngFileUpload',
  'ngTagsInput',
  'angularMoment',
  'ui.router'
])
  .config(function ($urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    // $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // $location.path('/');
    // Redirect to login if route requires auth and you're not logged in
    // $rootScope.$on('$routeChangeStart', function (event, next) {
    //   Auth.isLoggedInAsync(function(loggedIn) {
    //     if (next.authenticate && !loggedIn) {
    //       $location.path('/login');
    //     }
    //   });
    // });
  });
