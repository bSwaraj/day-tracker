angular.module("DayTrackerApp")
    .service("DayTrackerService", dayTrackerService);

dayTrackerService.$inject = ["DayTrackerDataService"];

function dayTrackerService(DayTrackerDataService) {

    let _dataService = DayTrackerDataService;

    var service = {
        init: _dataService.init,
        exists: _dataService.exists,
        add: _dataService.add,
        has: _dataService.has,
        update: _dataService.update,
        delete: _dataService.delete,
    };

    return service;
}