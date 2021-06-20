angular.module("DayTrackerApp")
    .component("dayReportComp", {
        controller: dayReportCtrl,
        controllerAs: "vm",
        templateUrl: "Components/DayReportComponent/day-report.comp.html"
    });

dayReportCtrl.$inject = [];

function dayReportCtrl() {
    var vm = this;


}