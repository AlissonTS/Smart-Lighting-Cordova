var app = angular.module('meuAPP', ['ionic'])

app.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

function exitApp()
{
    navigator.app.exitApp();
}
