'use strict';

module.component('calendarPanel', {
	templateUrl: '/calendar/panel/calendar-panel.component.html',
    controller: CalendarPanelController,
    bindings: {
    	professionals: '<',
    	selectedProfessional: '=',
    	period: '=',
    	view: '=',
    	selectedDay: '='
    }
})

function CalendarPanelController($scope) {
	const $ctrl = this;
	$scope.submitting = false;

	$scope.previous = () => {
		let period = getCurrentPeriod().subtract(1, getFlagView());
		setPeriod(period);
	}

	$scope.next = () => {
		let period = getCurrentPeriod().add(1, getFlagView());
		setPeriod(period);
	}

	$scope.today = () => {
		let period = moment();
		setPeriod(period);
	}

	$scope.changeView = (viewName) => {
		$ctrl.view = viewName;
	}

	function setPeriod(period) {
		console.log('setting period to: ' + period.format('ddd DD-MM-YYYY'));

		if ($ctrl.view === 'MONTH') {
			console.log('load month stuff...');
			// find more data
		}

		$ctrl.period = {
			year: period.year(),
			month: period.month(),
			date: period.date(),
			day: period.day(),
		}
	}

	function getCurrentPeriod() {
		return moment().year($ctrl.period.year).month($ctrl.period.month).date($ctrl.period.date);
	}

	function getFlagView(){
		return $ctrl.view === 'DAILY' ? 'd' : ($ctrl.view === 'MONTH' ? 'M' : 'w');
	}
}

