'use strict';

module.factory('AppointmentService', ['$http', '$q', ($http, $q) => {

    const APPOINTMENTS_URL = `/api/appointments`;

    const formatPeriod = (period) => {
        let tmpMonth = period.month + 1; 
        let month = (tmpMonth < 10) ? '0' + tmpMonth : tmpMonth;
        return `${period.year}${month}`;
    }

    return {

        getAppointments: (professionalId, period) => {
            let formattedPeriod = formatPeriod(period);
            var deferred = $q.defer();
            $http.get(`${APPOINTMENTS_URL}/${professionalId}/${formattedPeriod}`)
                .then(
                    sucess => deferred.resolve(sucess.data),
                    fail => deferred.reject(fail)
                );
            return deferred.promise;
        },

        createAppointment: (professionalId, appointmentRequest) => {
            var deferred = $q.defer();
            $http.post(`${APPOINTMENTS_URL}/${professionalId}`, appointmentRequest)
                .then(
                    sucess => deferred.resolve(sucess.data),
                    fail => deferred.reject(fail)
                );
            return deferred.promise;
        }

    }

}])