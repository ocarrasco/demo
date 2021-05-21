'use strict';

var module = angular.module('app', [
	'ngSanitize',
	'ui.bootstrap'
]);

module.filter('translateDay', () => {
	const DAY_LABELS = [
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	];
	return (input) => {
		return DAY_LABELS[input];
	}
})
.filter('translateMonth', () => {
	const MONTH_LABELS = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	return (input) => MONTH_LABELS[input];
})
.filter('hourFormat', () => {
	return (input) =>  input ? input + ':00' : '';
});