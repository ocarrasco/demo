'use strict';

angular.module(module.name).component('calendar', {
	templateUrl: '/calendar/calendar.component.html',
	controller: CalendarController
});

function CalendarController($rootScope, $scope, $location, SettingsService, AppointmentService) {
	const $ctrl = this;
	const now = moment();
	$scope.loading = true;

	$scope.period = {
		year: now.year(),
		month: now.month(),
		date: now.date(),
		day: now.day()
	}

	$ctrl.$onInit = () => {
		SettingsService.getSettings().then(loadSettings, dataError);
	}

	function loadSettings(branch) {
		$scope.selectedView = 'MONTH';
		$rootScope.branch = { id: branch.id, name: branch.name }
		$scope.selectedProfessional = branch.professionals[0];

		$scope.branch = branch;

		let professionalId = $scope.selectedProfessional.id;
		$scope.loading = false;

		AppointmentService
			.getAppointments(professionalId, $scope.period)
			.then(response => {
				console.log(response);
				$scope.appointments = response;
			});

		watchChangePeriod();
	}

	function watchChangePeriod() {
		$scope.$watch('period', (newVal, oldVal) => {
			if (newVal != oldVal) {
				$scope.$broadcast('periodChanged', { "period": newVal });
			}
		})
	}

	function dataError(fail) {
		if (fail.status === 404) {
			$location.path('offline');
		} else {
			console.error(fail);
		}
	}

}
