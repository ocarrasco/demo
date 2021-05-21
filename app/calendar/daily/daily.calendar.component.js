'use strict';

module.component('dailyCalendar', {
	controller: DailyCalendarController,
	templateUrl: '/calendar/daily/daily.calendar.component.html',
	bindings: {
		period: "<",
		branch: '<',
		view: '<',
		selectedProfessional: '<'
	}
})

function DailyCalendarController($scope, $uibModal) {
	const $ctrl = this;
	const DAYS_INDEXES = [
		'SUNDAY', 'MONDAY','TUESDAY', 'WEDNESDAY', 
		'THURSDAY','FRIDAY', 'SATURDAY'
	];

	var wasRender = false;
	var isClean = true;

	$ctrl.$onChanges = (changes) => {
		if (isAvailabilityLoaded(changes) && !wasRender) {
			renderCalendar();
		} else if ($ctrl.view === 'DAILY' && changes.period) {
			fillCalendar();
		}
	}

	function isAvailabilityLoaded(changes) {
		return angular.isDefined(changes.branch) && angular.isDefined(changes.branch.currentValue);
	}

	function fillCalendar() {
		const selectedDayName = DAYS_INDEXES[$ctrl.period.day];
		var selectedConfig = $ctrl.branch.availability.days.filter(e => e.dayOfWeek === selectedDayName)[0];
		clearCalendar();

		if (!selectedConfig || !selectedConfig.enabled) {
			return;
		}

		var morningConfig = selectedConfig.periods.filter(p => p.type === 'MORNING')[0];
		var afternoonConfig = selectedConfig.periods.filter(p => p.type === 'AFTERNOON')[0];

		var calculatedMorningRange = [
			morningConfig ? encodeTime(morningConfig.fromTime) : 0,
			morningConfig ? encodeTime(morningConfig.toTime) : 0
		];

		var calculatedAfternoonRange = [
			afternoonConfig ? encodeTime(afternoonConfig.fromTime) : 0,
			afternoonConfig ? encodeTime(afternoonConfig.toTime) : 0
		];

		$scope.hours.forEach(e => {
			e.morning.enabled = morningConfig && morningConfig.enabled && e.morning.hour < 13;
			e.afternoon.enabled = afternoonConfig && afternoonConfig.enabled && e.afternoon.hour < 24;

			if (e.morning.enabled) {
				let currentMorningTime = e.morning.hour * 60;
				for (let i = 0; i < e.morning.mins.length; i++) {
					let item = e.morning.mins[i];
					let tmp = currentMorningTime + item.time;
					item.enabled = tmp >= calculatedMorningRange[0] && tmp < calculatedMorningRange[1];
				}
			}

			if (e.afternoon.enabled) {
				let currentAfternoonTime = e.afternoon.hour * 60;
				for (let i = 0; i < e.afternoon.mins.length; i++) {
					let item = e.afternoon.mins[i];
					let tmp = currentAfternoonTime + item.time;
					item.enabled = tmp >= calculatedAfternoonRange[0] && tmp < calculatedAfternoonRange[1];
				}
			}
		})

		isClean = false;
	}

	$scope.checkAppointment = (hour, min) => {
		var modalInstance = $uibModal.open({
			keyboard: false,
			backdrop: 'static',
			component: 'appointmentModalComponent',
			resolve: {
				selectedDate: () => $ctrl.period,
				selectedTime: () => { return { "hour": hour, "min": min } },
				selectedProfessional: () => $ctrl.selectedProfessional
			}
		});

		modalInstance.result.then(() => {

		}, () => { })
	}

	function renderCalendar() {
		const availability = $ctrl.branch.availability.days;
		let minMorningStartHour = searchConfig('min', availability, 'MORNING', 'fromTime');
		let maxMorningEndHour = searchConfig('max', availability, 'MORNING', 'toTime');

		let minAfternoonStartHour = searchConfig('min', availability, 'AFTERNOON', 'fromTime');
		let maxAfternoonEndtHour = searchConfig('max', availability, 'AFTERNOON', 'toTime');

		let slotCount = Math.max(maxMorningEndHour - minMorningStartHour, maxAfternoonEndtHour - minAfternoonStartHour);
		let items = [];

		for (let i = 0; i < slotCount; i++) {
			let currentMorningHour = minMorningStartHour + i;
			let currentAfternoonHour = minAfternoonStartHour + i;
			let item = {
				morning: { enabled: false, hour: currentMorningHour, mins: [] },
				afternoon: { enabled: false, hour: currentAfternoonHour, mins: [] }
			}

			for (let j = 0; j < 4; j++) {
				let currentMin = j * 15;
				item.morning.mins = [...item.morning.mins, { time: currentMin, enabled: false }];
				item.afternoon.mins = [...item.afternoon.mins, { time: currentMin, enabled: false }];
			}

			items = [...items, item];
		}

		$scope.hours = items;
		wasRender = true;
	}

	function searchConfig(func, arr, label, type) {
		var items = arr.filter(e => e.enabled)
			.flatMap(e => e.periods)
			.filter(e => e.enabled && e.type === label)
			.map(e => decodeTime(e[type]).hour);
		return Math[func].apply(Math, items);
	}

	function clearCalendar() {
		if (isClean) {
			return;
		}

		$scope.hours.forEach(e => {
			e.morning.enabled = false;
			e.morning.mins.forEach(m => m.enabled = false);

			e.afternoon.enabled = false;
			e.afternoon.mins.forEach(m => m.enabled = false);
		})
	}

	function encodeTime(strTime) {
		let tmp = decodeTime(strTime);
		return tmp.hour * 60 + tmp.min;;
	}

	function decodeTime(strTime) {
		let tmp = strTime.split(':');
		return {
			hour: parseInt(tmp[0], 10),
			min: parseInt(tmp[1], 10)
		};
	}

}
