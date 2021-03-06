var portfolioApp = angular.module('portfolioApp', ['ngRoute']);

portfolioApp.config(function($routeProvider) {
  $routeProvider
    .when('/main', {
      templateUrl: 'partials/main.html',
      controller:  'MainController'
    }).when('/blog/:blogpost', {
      templateUrl: 'partials/blogpost.html',
      controller: 'BlogpostController'
    }).when('/:field', {
      templateUrl: 'partials/field.html',
      controller:  'FieldController'
    }).when('/:field/:project', {
      templateUrl: 'partials/project.html',
      controller:  'ProjectController'
    }).otherwise({
      redirectTo: '/main'
    });
});

portfolioApp.controller('MainController', function($scope) {
});

portfolioApp.controller('HeaderController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
  $scope.fields = ['Art', 'Design', 'Apparel', 'Writing', 'Video', 'Code', 'About'];
  $scope.url = $routeParams;
}]);

portfolioApp.controller('FieldController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.linkType = "noHover";
    $scope.field = $routeParams.field;
    $http.get('json/' + $routeParams.field + '.json').success(function(data) {
      $scope.snippets = data;
      if ($scope.snippets[0].hasOwnProperty('liveLinkText')) {
        $scope.showButtons = false;
        $scope.linkType = "hover";
      }
      if ($scope.snippets[0].hasOwnProperty('extTarget')) {
        $scope.showButtons = false;
        $scope.linkType = "external";
      }
    });
}]);

portfolioApp.controller('ProjectController', ['$scope', '$http', '$routeParams', '$sce', function($scope, $http, $routeParams, $sce) {
    $scope.format = 'basic';
    $http.get('json/projects/' + $routeParams.project + '.json').success(function(data) {
      $scope.contents = data[0];
      if ($scope.contents.hasOwnProperty('videoURLs')) {
        $scope.format = 'video';
      }
      if ($scope.contents.hasOwnProperty('articleLink')) {
        $scope.hasLink = true;
      }
      if ($scope.contents.hasOwnProperty('articleURLs')) {
        $scope.format = 'article';
      }
      if ($scope.contents.hasOwnProperty('pdfURLs')) {
        $scope.format = 'pdf';
      }
    });
}]);

// portfolioApp.controller('BlogController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
//     $http.get('json/bloglist.json').success(function(data) {
//       $scope.bloglist = data;
//     });
// }]);

// portfolioApp.controller('BlogpostController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
//     $http.get('json/blogposts/' + $routeParams.blogpost + '.json').success(function(data) {
//       $scope.stuff = data[0];
//     });
// }]);

portfolioApp.filter('trustURL', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  }
});
