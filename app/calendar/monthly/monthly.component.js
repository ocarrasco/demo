'use strict';

module.component('monthlyCalendar', {
	controller: MonthlyCalendarController,
	templateUrl: '/calendar/monthly/monthly.component.html',
	bindings: {
		appointments: '<',
		period: "=",
		view: "="
	}
})

function MonthlyCalendarController($scope) {
	const $ctrl = this;
	const DAYS_PER_WEEK = 7;

	$scope.weeks = [];

	$ctrl.$onInit = () => {
		let period = $ctrl.period;
		render(period);
	}

	$scope.$on('periodChanged', (event, args) => {
		if ($ctrl.view === 'MONTH') {
			render(args.period);
		}
	});

	function render(period) {
		var tmp = moment().year(period.year).month(period.month).startOf('month');
		var firstWeekDayOfMonth = tmp.isoWeekday();
		var lastDayOfMonth = tmp.endOf('month').date();

		let weeks = [];
		let dayNumber = 1;
		let started = false;
		let done = false;

		do {
			let week = [];
			for (let i = 0; i < DAYS_PER_WEEK; i++) {
				let day = { enabled: false };				
				if (!started && ((firstWeekDayOfMonth - 1) === i)){
					started = true;
				}

				if (started && !done) {
					day.enabled = true;
					day.number = dayNumber; 
					dayNumber++;
				}

				week.push(day);

				if (dayNumber > lastDayOfMonth) {
					done = true;
				}
			}
			weeks.push(week);
		} while (!done);

		$scope.weeks = weeks;
		checkToday(period);
	}

	function checkToday(period) {
		var now = moment();
		if (now.month() !== period.month || now.year() !== period.year) {
			return;
		}

		let date = now.date();
		let $today = $scope.weeks.flatMap(e => e).filter(e => e.number && e.number == date);
		$today[0].aggregatedClasses = 'today';
	}

	$scope.showDailyCalendar = (date) => {
		let tmp = moment().year($ctrl.period.year).month($ctrl.period.month).date(date);
		$ctrl.period = {
			year: tmp.year(),
			month: tmp.month(),
			date: tmp.date(),
			day: tmp.day()
		}
		$ctrl.view = 'DAILY';
	}
}

