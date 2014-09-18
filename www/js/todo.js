angular.module('todo', ['ionic', 'todo.services'])

.controller('TodoCtrl', function($scope, $ionicModal, $ionicPopup, SQLService) {

  SQLService.setup();

  $scope.loadTask = function() {
    // $scope.tasks = [
    //   {'task_id':1, 'task_name':'Tâche 01'},
    //   {'task_id':2, 'task_name':'Tâche 02'},
    //   {'task_id':3, 'task_name':'Tâche 03'}
    // ]
    SQLService.all().then(function(results) {
      $scope.tasks = results;
    });
  }

  $scope.loadTask();

  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newTask = function() {
    // alert('show');
    $scope.taskModal.show();
  }

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.createTask = function(task) {
    // save task
    SQLService.set(task.title);
    $scope.loadTask();
    $scope.taskModal.hide();
    task.title="";
  }

  $scope.onItemDelete = function(taskid) {
    $ionicPopup.confirm({
      title: 'Confirmation',
      content: 'Voulez-vous vraiment supprimer cette tâche ?'
    }).then(function(res) {
      if (res) {
        // detele task
        SQLService.del(taskid);
        $scope.loadTask();
      }
    });
  }

  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
      title: 'Modifier',
      subTitle: 'Modification de la tâche :'
    }).then(function(res) {
      // edit task
      SQLService.edit(res, taskid);
      $scope.loadTask();
    });
  }

  $scope.moveItem = function(item, fromIndex, toIndex) {
    alert(item + ' / ' + fromIndex + ' / ' + toIndex);
    // $scope.items.splice(fromIndex, i);
    // $scope.items.splice(toIndex, 0, item);
  }

})



