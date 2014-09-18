angular.module('todo.services', ['ionic'])

.factory('SQLService', function($q) {

  var db;

  function createDB() {
    // alert('create');
    try {
      db = window.openDatabase("todoDB", "1.0", "ToDoApp", 10*1024*1024);
      db.transaction(function(tx) {
        tx.executeSql("create table if not exists tasks (task_id integer not null primary key autoincrement, task_name varchar(100) )", [] );
      });
    }catch (err) {
      alert('Error processing SQL: ' + err);
    }
  }

  function setTasks(tname) {
    // alert('set');
    return promisedQuery("insert into tasks (task_name) values ('" + tname + "') ", defaultResultHandler, defaultErrorHandler);
  }

  function delTasks(tid) {
    // alert('del');
    return promisedQuery("delete from tasks where task_id = " + tid , defaultResultHandler, defaultErrorHandler);
  }

  function updateTasks(tname, tid) {
    // alert('update');
    return promisedQuery("update tasks set task_name = '" + tname + "' where task_id = " + tid , defaultResultHandler, defaultErrorHandler);
  }

  function getTasks() {
    // alert('get');
    return promisedQuery("select * from tasks", defaultResultHandler, defaultErrorHandler);
  }

  function defaultResultHandler(deferred) {
    // alert('result');
    return function(tx, results) {
      var len = results.rows.length;
      var output_results = [];

      for (var i = 0; i < len; i++) {
        var t = {
          'task_id': results.rows.item(i).task_id,
          'task_name': results.rows.item(i).task_name
        };
        output_results.push(t);
      }

      deferred.resolve(output_results);
    }
  }

  function defaultErrorHandler(deferred) {
    // alert('error');
    return function(tx, results) {
      var len = 0;
      var output_results = '';
      deferred.resolve(output_results);
    }
  }

  function promisedQuery(query, successDB, errorDB) {
    // alert('promisedQuery');
    var deferred = $q.defer();
    // alert(deferred);
    db.transaction(function(tx) {
      tx.executeSql(query, [], successDB(deferred), errorDB(deferred));
    }, errorDB);
    return deferred.promise;
  }

  return {
    setup: function() {
      return createDB();
    },
    set: function(t_name) {
      return setTasks(t_name);
    },
    del: function(taskid) {
      return delTasks(taskid);
    },
    edit: function(t_name, taskid) {
      return updateTasks(t_name, taskid);
    },
    all: function() {
      return getTasks();
    }
  }

})



