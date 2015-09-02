    var parsePlugin = {
        initialize: function(appId, clientKey, successCallback, errorCallback) {
            exec(
                successCallback,
                errorCallback,
                'ParsePlugin',
                'initialize',
                [appId, clientKey]
                );
        },

        getInstallationId: function(successCallback, errorCallback) {
            exec(
                successCallback,
                errorCallback,
                'ParsePlugin',
                'getInstallationId',
                []
                );
        },

        getInstallationObjectId: function(successCallback, errorCallback) {
            exec(
                successCallback,
                errorCallback,
                'ParsePlugin',
                'getInstallationObjectId',
                []
                );
        },

        getSubscriptions: function(successCallback, errorCallback) {
            exec(
                successCallback,
                errorCallback,
                'ParsePlugin',
                'getSubscriptions',
                []
                );
        },

        subscribe: function(channel, successCallback, errorCallback) {
            exec(
                successCallback,
                errorCallback,
                'ParsePlugin',
                'subscribe',
                [ channel ]
                );
        },

        unsubscribe: function(channel, successCallback, errorCallback) {
            exec(
                successCallback,
                errorCallback,
                'ParsePlugin',
                'unsubscribe',
                [ channel ]
                );
        }
    };

    var exec = require("cordova/exec");

    // module.exports = parsePlugin;