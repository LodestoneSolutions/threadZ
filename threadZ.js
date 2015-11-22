'use strict';

/**
 * threadZ is a lightweight library used to create javascript threads
 * Written by Nadav AncientZed Yogev and Or som0 Straze for Lodestone Solutions pty ltd
 *http://www.lodestonesolutions.com.au
 *use is as follows:
 *var funcToRun = function(){....};//can have up to 4 vars -> funcToRun = function(a,b,c,d){....};
 *var funcToRunOnComplete = function(res){....};//res is the return value of funcToRun
 *threadZ.addTask(funcToRun,funcToRunOnComplete,var1,...,var4); //vars are optional can just aswell call threadZ.addTask(funcToRun,funcToRunOnComplete)
 *threadZ.run();//will execute all the pending functions on different threads, max 3 at the time can be configured otherwise as well
**/

var threadZ = {};
threadZ.tasks = [];// { func: taskFunc, onComplete: oncomplete, id: guid() }
threadZ.runningTasks = [];//{ task: {func:taskFunc, onComplete: oncomplete, id: guid()}, process: processor }
threadZ.maxThreads = 3;
threadZ.limit = 100;
threadZ.interval = 100;

threadZ.run = function () {
    for (var j = 0; j < threadZ.tasks.length; j++) {
        if (threadZ.runningTasks.length < threadZ.maxThreads) {
            threadZ.execute(j, threadZ.tasks[j].id);
            j--;
        } else {
            break;
        }
    }

};

threadZ.execute = function (index, id) {
    //add a new thread of max limit has not been reached
    threadZ.runningTasks.push({
        task: threadZ.tasks[index],
        process: setInterval(function () {
            var task = threadZ.getTask(id);
            if (!task) {//task not found, clear its id
                threadZ.clearIntervalById(id);
                return;
            }
            var res = task.task.func(task.task.var1, task.task.var2, task.task.var3, task.task.var4);
            //debugger;
            if (typeof task.task.onComplete == 'function') {
                task.task.onComplete(res);
            }

            threadZ.removeRunningTask(id);
        }, threadZ.interval)

    });
    threadZ.tasks.splice(index, 1); //task added to running tasks -> remove from the pending
};

/**
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
threadZ.getGuid = function () {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }

    return _p8() + _p8(true) + _p8(true) + _p8();
};
threadZ.addTask = function (taskFunc, oncomplete, var1, var2, var3, var4) {
    threadZ.tasks.push({ func: taskFunc, onComplete: oncomplete, id: threadZ.getGuid(), var1: var1, var2: var2, var3: var3, var4: var4 });
};

threadZ.clearIntervalById = function (id) {
    for (var i = 0; i < threadZ.runningTasks.length; i++) {
        if (threadZ.runningTasks[i].task.id === id) {
            clearInterval(threadZ.runningTasks[i].process);
        }
    }
};
threadZ.removeRunningTask = function (id) {
    for (var i = 0; i < threadZ.runningTasks.length; i++) {
        if (threadZ.runningTasks[i].task.id === id) {
            clearInterval(threadZ.runningTasks[i].process);
            threadZ.runningTasks.splice(i, 1);
        }
    }
    if (threadZ.runningTasks.length < threadZ.maxThreads && threadZ.tasks.length > 0) {
        threadZ.execute(0, threadZ.tasks[0].id);
    }
};
threadZ.getTask = function (id) {
    for (var i = 0; i < threadZ.runningTasks.length; i++) {
        if (threadZ.runningTasks[i].task.id === id) {
            return threadZ.runningTasks[i];
        }
    }
    return undefined;
};

// Used to check if wait function already active, no need for multiple wait functions when adding new tasks
threadZ.waiting = function () {
    var alreadyWaiting = false;
    threadZ.tasks.forEach(function (task) {
        if (task.func === threadZ.waitFunction) {
            alreadyWaiting = true;
        }
    });
    threadZ.runningTasks.forEach(function (task) {
        if (task.task.func === threadZ.waitFunction) {
            alreadyWaiting = true;
        }
    });
    return alreadyWaiting;
};

// Used to execute a function when entire task list is finished, should be added before threadZ.run()
// Example: threadZ.addTask(threadZ.waitFunction, null, doWhenDoneFunction);
threadZ.waitFunction = function (onComplete) {
    if (threadZ.runningTasks.length > 1) {
        threadZ.addTask(threadZ.waitFunction, null, onComplete);
    }
    else {
        if (typeof onComplete == 'function') {
            onComplete();
        }
    }
};

