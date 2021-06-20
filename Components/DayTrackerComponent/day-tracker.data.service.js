angular.module("DayTrackerApp")
    .service("DayTrackerDataService", dayTrackerDataService);

dayTrackerDataService.$inject = ["LocalStorageService"];

function dayTrackerDataService(LocalStorageService) {

    var service = {
        init: LocalStorageService.init,
        exists: LocalStorageService.exists
    };

    return service;
}