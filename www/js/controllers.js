angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {



  $scope.option=240;
  $scope.scoreboard=null;








  var current=JSON.parse(window.localStorage.standard||'null')

  if(current=null){


    window.localStorage.standard=0;
  }








var current=JSON.parse(window.localStorage.grand||'null')

  if(current=null){


    window.localStorage.grand=0;
  }





 

})





.controller('gameCtrl', function($scope, $ionicModal, $timeout,$log,$cordovaVibration) {


 $ionicModal.fromTemplateUrl('templates/pause.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.pauseModal = modal;
});


$scope.pause=function(){

  $scope.$broadcast('timer-stop');
  $scope.timerRunning = false;

  $scope.pauseModal.show()
}


$scope.resume=function(){
  $scope.$broadcast('timer-resume');
  $scope.timerRunning = true;

  $scope.pauseModal.hide()

}
console.log('Game Ctrl')

$scope.matrix=[];
$scope.isStarted=false;
$scope.maxNum = 160000;

$scope.stage = 1;
$scope.counter=1;
$scope.isFinished=false
var timeLimit=$scope.option;
$scope.count=timeLimit;


var nextArr=[];


$scope.$on('$ionicView.enter',function(){

init()
});
function init(){

  timeLimit=$scope.option
  $scope.count=timeLimit;
  $scope.matrix=[];
  $scope.isStarted=false;
  $scope.isFinished=false
  $scope.stage = 1;
  $scope.counter=1;
  $scope.$broadcast('timer-set-countdown',timeLimit)
  gameInit();
}

function gameInit(){


  var arr=[]
  while(arr.length < 16){
    var randomnumber = Math.ceil(Math.random()*16)
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
    $scope.matrix.push({value:randomnumber , isClicked:false});
  }

  $log.debug("Start",$scope.matrix)

}

function nextInit(stage){


  var max=stage*16-1
  var min=stage*16-16


  var arr=[]
  while(arr.length < 16){
    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min+1;
    if(arr.indexOf(randomnumber) > -1) continue;
    arr[arr.length] = randomnumber;
    nextArr[arr.length-1]=randomnumber;
  }

  $log.debug("Next Generated",$scope.matrix,nextArr)

}

$scope.click=function(button,index){
  $log.debug("Click",button)
  if(button.value==$scope.counter){


    if(button.value==$scope.maxNum){
      $scope.finishGame();
    } else if(button.value%16==1){
     $scope.stage++;
     nextInit($scope.stage);

   }

   if(button.value+15<$scope.maxNum){

    button.value=nextArr[index]

  }else  button.isClicked=true;


  if($scope.isStarted==false){
    $scope.startGame();
    $scope.isStarted=true;
  }



  $scope.counter++;
}
$log.debug("Click",button)


}

$scope.restart=function(){

 $scope.$broadcast('timer-stop');
 $scope.timerRunning = false;

 init()


}

$scope.$on('timer-stopped', function (event, data){


  $log.debug(data)
  if($scope.isFinished){

    $log.debug("Finished With "+$scope.counter + " tap")
  saveHighScore($scope.counter);

  alert("You Finish with score"+$scope.counter)
    $scope.$apply();
  }else $log.debug("Stop but not finish")
});

$scope.startGame = function (){
  $scope.$broadcast('timer-start');
    $cordovaVibration.vibrate(500);
  $scope.timerRunning = true;
};

$scope.finishGame = function (){
  //$cordovaVibration.vibrate(500);
  $scope.isFinished=true;
  $scope.isStarted=false;

  $log.debug('Finish Game')
  $scope.$broadcast('timer-stop');
  $scope.timerRunning = false;


};





 function saveHighScore(score){


if($scope.$parent.option==240){
  var current=JSON.parse(window.localStorage.standard||'null')

  if(current==null){


    window.localStorage.standard=score;
  }
}




if($scope.$parent.option==480){


var current=JSON.parse(window.localStorage.grand||'null')

  if(current==null){


    window.localStorage.grand=score;
  }


}


 }


init();

})

.controller('mainCtrl', function($scope, $ionicModal, $timeout,$log,$state,$ionicPopup) {


$scope.highscore={
grand:JSON.parse(window.localStorage.grand||0),
standard:JSON.parse(window.localStorage.standard||0)

}


  $scope.$on('$ionicView.enter',function(){


$scope.highscore={
grand:JSON.stringify(window.localStorage.grand),
standard:JSON.stringify(window.localStorage.standard)

}
 


  })

   $ionicModal.fromTemplateUrl('templates/help.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.helpModal = modal;
});
 $ionicModal.fromTemplateUrl('templates/highscore.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.highModal = modal;
});


$scope.custom={

  value:null
}

  $scope.choice={
   standard:function(){ 
    $log.debug("Choose Standard")
   $scope.$parent.option=120;

   $state.go('app.browse');

 },
 grand:function(){

 $log.debug("Choose Standard")
   $scope.$parent.option=240;

   $state.go('app.browse');



 },custom:function(){

 $ionicPopup.show({
    template: '<input type="number" ng-model="custom.value" >',
    title: 'Custom Challenge',
    subTitle: 'Enter the time limit you want (In Second)',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Go</b>',
        type: 'button-dark',
        onTap: function(e) {
          if (!$scope.custom.value) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {



            $scope.$parent.option=$scope.custom.value


            return  $state.go('app.browse');

          }
        }
      }
    ]
  });
 }

}
 $scope.help=function(){







 }



})


