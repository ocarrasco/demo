'use strict';

module.component('appointmentModalComponent', {
	templateUrl: '/calendar/appointment-management/appointment-modal.component.html',
	controller: AppointmentModalController,
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
});

function AppointmentModalController($scope, AppointmentService) {
	const $ctrl = this;

	$ctrl.$onInit = () => {
		$scope.menus = angular.copy($ctrl.resolve.selectedProfessional.menu);

		let initialTime = new Date();
		let startHour = $ctrl.resolve.selectedTime.hour;
		let startMin = $ctrl.resolve.selectedTime.min;

		initialTime.setHours(startHour);
		initialTime.setMinutes(startMin);

		$scope.selectedMenu = $scope.menus[0];

		$scope.timeFrom = initialTime;
		$scope.timeTo = calculateSuggestedEndTime(initialTime, $scope.selectedMenu);
	}

	$scope.confirm = () => {
		let appointmentRequest = {};
		appointmentRequest.contact = angular.copy($scope.contact);
		appointmentRequest.service = angular.copy($scope.selectedMenu);
		appointmentRequest.start = calculateTime($scope.timeFrom);
		appointmentRequest.end = calculateTime($scope.timeTo);
		appointmentRequest.date = formatPeriod($ctrl.resolve.selectedDate);

		AppointmentService
			.createAppointment($ctrl.resolve.selectedProfessional.id, appointmentRequest)
			.then(success, failure);
	}

	function success(response) {
		console.log(response);
		$ctrl.dismiss();
	}

	function failure(response) {
		console.log(response);
	}

	function formatPeriod(period) {
		return moment().year(period.year).month(period.month).date(period.date).format('YYYY-MM-DD');
	}

	function calculateSuggestedEndTime(time, selectedMenu) {
		var tmp = moment(time).add(selectedMenu.timespan, 'minutes');
		return tmp.toDate();
	}

	function calculateTime(rawDate) {
		let from = moment(rawDate);
		let hour = parseInt(from.format('H'), 10);
		let min = parseInt(from.format('m'), 10);
		return hour * 60 + min;
	}

}