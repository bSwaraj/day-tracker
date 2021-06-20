angular.module("DayTrackerApp")
    .component("dayTrackerComp", {
        controller: dayTrackerCtrl,
        controllerAs: "vm",
        templateUrl: "Components/DayTrackerComponent/day-tracker.comp.html"
    });

dayTrackerCtrl.$inject = ["LocalStorageService"];

function dayTrackerCtrl(LocalStorageService) {
    var vm = this;

    var key = "day-tracker";
    var totalData = {};
    var _data = {};
    var _tasksInfo = {};
    var dayId = null;
    var taskInProgress = false;
    var trackingStarted = false;

    vm.taskName = "";
    vm.timeFormat = "hh:mm:ss a";
    vm.isSignedIn = false;

    vm.$onInit = initialize;
    vm.getTasks = getItems;
    vm.addTask = addTask;
    vm.deleteTask = deleteTask;
    vm.completeTask = completeTask;
    vm.hasTasks = hasTasks;
    vm.signIn = signIn;
    vm.signOut = signOut;

    function signIn() {
        _data.start = new Date();
        vm.isSignedIn = true;
        trackingStarted = true;
    }

    function signOut() {
        vm.isSignedIn = false;
        trackingStarted = false;
        _data.end = new Date();
    }

    function hasTasks() {
        return Object.keys(_tasksInfo).length;
    }

    function completeTask(task) {
        if (!isLoggedIn()) return;
        task.end = new Date();
        _tasksInfo[task.id].status = 2;
        taskInProgress = false;
        updateStorage();
    }

    function initialize() {
        LocalStorageService.init();
        if (!LocalStorageService.exists()) {
            vm.notSupported = "Your browser doesn't support local storage. Unable to continue."
            return;
        }
        dayId = getDayId();
        getData();
        vm.storage = LocalStorageService.size();
    }

    function getData() {
        totalData = LocalStorageService.get(key, {});
        if (!totalData.hasOwnProperty(dayId)) {
            totalData[dayId] = {
                start: null,
                end: null,
                tasks: {},
                user: "dummy"
            }
        }
        _data = totalData[dayId];
        _tasksInfo = _data["tasks"];
        if (hasTasks()) {
            var tasks = Object.values(_tasksInfo);
            for (let task in tasks) {
                if (task.status == 1) {
                    taskInProgress = true;
                    break;
                }
            }
        }
    }



    function prefix(number) {
        return number <= 9 ? `0${number}` : number;
    }

    function getDayId() {
        var d = new Date();
        return `${d.getUTCFullYear()}${prefix(d.getMonth()+1)}${prefix(d.getDate())}`;
    }

    function getItems() {
        var items = Object.keys(_tasksInfo);
        var list = [];
        if (items.length) {
            items.forEach(function(index) {
                list.push(_tasksInfo[index]);
            });
        }
        return list;
    }

    function isLoggedIn() {
        if (!trackingStarted || !vm.isSignedIn) {
            alert("You are not logged in yet!");
            return false;
        }
        return true;
    }

    function addTask() {
        if (!isLoggedIn()) return;
        if (!vm.taskName) return;
        if (taskInProgress) {
            alert("Please Complete the Running Task.");
            return;
        }

        var task = {
            id: getTaskId(),
            name: vm.taskName,
            start: new Date(),
            end: null,
            status: 1
        };
        _tasksInfo[task.id] = task;
        updateStorage();
        vm.taskName = "";
        taskInProgress = true;
    }

    function getTaskId() {
        if (!hasTasks()) return 1;
        return Object.values(_tasksInfo).reduce(function(a, b) {
            return a > b ? a : b;
        }).id + 1;
    }

    function deleteTask(task) {
        if (!isLoggedIn()) return;
        if (confirm("Are you sure to delete?")) {
            if (task.status == 1)
                taskInProgress = false;
            delete _tasksInfo[task.id];
            updateStorage();
        }
    }

    function updateStorage() {
        if (!LocalStorageService.exists()) return;

        LocalStorageService.save(key, totalData);
        vm.storage = LocalStorageService.size();
    }
}