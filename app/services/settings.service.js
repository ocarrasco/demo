'use strict';

module.factory('SettingsService', ['$http', '$q', ($http, $q) => {

	const SETTINGS_API = `/api/settings.json`;

	return {
		getSettings: () => {
			var deferred = $q.defer();
			$http.get(SETTINGS_API).then(
				success => deferred.resolve(success.data), 
				fail => deferred.reject(fail)
			)
			return deferred.promise;
		}
	}
}])