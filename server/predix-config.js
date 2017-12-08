/*
This module reads config settings from localConfig.json when running locally,
  or from the VCAPS environment variables when running in Cloud Foundry.
*/

var settings = {};

// checking NODE_ENV to load cloud properties from VCAPS
// or development properties from config.json.
var node_env = process.env.node_env || 'development';
if(node_env === 'development') {
  // use localConfig file
	var devConfig = require('./localConfig.json')[node_env];
	// console.log(devConfig);
	settings.base64ClientCredential = devConfig.base64ClientCredential;
	settings.loginBase64ClientCredential = devConfig.loginBase64ClientCredential;
	settings.uaaURL = devConfig.uaaURL;
	settings.tokenURL = devConfig.uaaURL;
	settings.appURL = devConfig.appURL;
	settings.callbackURL = devConfig.appURL + '/callback';

} else {
	// read VCAP_SERVICES
	var vcapsServices = JSON.parse(process.env.VCAP_SERVICES);
	var uaaService = vcapsServices[process.env.uaa_service_label];

	if(uaaService) {
    	settings.uaaURL = uaaService[0].credentials.uri;
		settings.tokenURL = uaaService[0].credentials.uri;
	}

	// read VCAP_APPLICATION
	var vcapsApplication = JSON.parse(process.env.VCAP_APPLICATION);
	settings.appURL = 'https://' + vcapsApplication.uris[0];
	settings.callbackURL = settings.appURL + '/callback';
	settings.base64ClientCredential = process.env.base64ClientCredential;
	settings.loginBase64ClientCredential = process.env.loginBase64ClientCredential;
}
// console.log('config settings: ' + JSON.stringify(settings));

// This vcap object is used by the proxy module.
settings.buildVcapObjectFromLocalConfig = function(config) {
	'use strict';
	// console.log('local config: ' + JSON.stringify(config));
	var vcapObj = {};
	if (config.uaaURL) {
		vcapObj['predix-uaa'] = [{
			credentials: {
				uri: config.uaaURL
			}
		}];
	}
	return vcapObj;
};

settings.isUaaConfigured = function() {
	return settings.uaaURL &&
    settings.uaaURL.indexOf('https') === 0 &&
    settings.base64ClientCredential &&
	settings.base64ClientCredential.indexOf('client') < 0 &&
	settings.loginBase64ClientCredential &&
	settings.loginBase64ClientCredential.indexOf('client') < 0;
};

function getValueFromEncodedString(encoded, index) {
	if (!encoded) {
		return '';
	}
	var decoded = new Buffer(encoded, 'base64').toString();
	// console.log('DECODED:  ' + decoded);
	var values = decoded.split(':');
	if (values.length !== 2) {
		throw "base64 encoded client credential is not correct. \n It should be the base64 encoded value of: 'client:secret' \n Set in localConfig.json for local dev, or environment variable in the cloud.";
	}
	return values[index];
}

settings.getSecretFromEncodedString = function(encoded) {
	return getValueFromEncodedString(encoded, 1);
}

settings.getClientIdFromEncodedString = function(encoded) {
	return getValueFromEncodedString(encoded, 0);
}

// redis is strange, since the service name is not constant.
//  could be redis-1, redis-2, etc.
settings.getRedisCredentials = function() {
	var vcaps = JSON.parse(process.env.VCAP_SERVICES || '{}');
	var creds;
	Object.keys(vcaps).forEach(function(vcap) {
		if (vcap.indexOf('redis') > -1) {
			creds = vcaps[vcap][0].credentials;
		}
	});
	return creds;
}

module.exports = settings;
