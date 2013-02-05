spoonmod.controller('SpoonController', function SpoonController($scope, spoonStorage) {
    var spoons = $scope.spoons = spoonStorage.get();

    $scope.$watch('spoons', function(){          
    spoonStorage.put(spoons);
  }, true);

    $scope.addSpoon = function() {


        var first = $scope.spoonText;
        var second = $scope.spoonText2;

        var firstLetters = first.split("");
        var firstLetter = firstLetters[0];
        firstLetters.splice(0, 1);


        var secondLetters = second.split("");
        var secondLetter = secondLetters[0];
        secondLetters.splice(0, 1);

        var spoon1 = firstLetters.join("");
        var spoon2 = secondLetters.join("");
        $scope.spoons.push({
            firstWord: secondLetter + spoon1,
            secondWord: firstLetter + spoon2
        });
        $scope.spoonText = '';
        $scope.spoonText2 = '';
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.spoons, function(spoon) {
            count += spoon.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function() {
        var oldSpoons = $scope.spoons;
        $scope.spoons = [];
        angular.forEach(oldSpoons, function(spoon) {
            if (!spoon.done) $scope.spoons.push(spoon);
        });
    };

});