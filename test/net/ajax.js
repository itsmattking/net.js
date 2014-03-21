function apiUrl(uri) {
	return ['http://127.0.0.1:8000', uri.replace(/^\/+/, '')].join('/');
}

function asyncHandler(func) {
	return function() {
		start();
		func.apply(func, Array.prototype.slice.call(arguments, 0));
	};
}

function noError() {
	return asyncHandler(function() {
		ok(false, 'Should not call the error function');
	});
}

function noSuccess() {
	return asyncHandler(function() {
		ok(false, 'Should not call the success function');
	});
}

asyncTest("Makes a successful GET request using net.ajax.get", function() {
	window.net.ajax.get({
		url: apiUrl('/data/test'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'Hi There'), 'responseText matches');
		}),
		error: noError()
	});
});

asyncTest("Makes a successful POST request using net.ajax.get", function() {
	window.net.ajax.post({
		url: apiUrl('/test-post'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok(req.responseText === '{"abc":123}', "responseText is a JSON string");
		}),
		error: noError()
	});
});

asyncTest("Handles not found request using net.ajax.get", function() {
	window.net.ajax.get({
		url: apiUrl('/data/test/not-found'),
		success: asyncHandler(function(req) {
			ok(false, 'Should not have called success');
		}),
		error: asyncHandler(function(req) {
			ok(true, 'fires the error function');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
		})
	});
});

asyncTest("Handles invalid status when using net.ajax.get", function() {
	window.net.ajax.get({
		url: apiUrl('/data/test/server-error'),
		success: asyncHandler(function(req) {
			ok(false, 'Should not have called success');
		}),
		error: asyncHandler(function(req) {
			ok(true, 'fires the error function');
			ok(req.status === 500, 'Is a 500 error');
		})
	});
});

asyncTest("Calls success handler when status code not accounted for", function() {
	window.net.ajax.get({
		url: apiUrl('/data/test/weird-status'),
		success: asyncHandler(function(req) {
			ok(true, 'fires the success function');
			ok(req.status === 444, 'matches the status code');
		}),
		error: noError()
	});
});

asyncTest("Returns a string of JSON when hitting a JSON endpoint", function() {
	window.net.ajax.get({
		url: apiUrl('/data/test-json'),
		success: asyncHandler(function(req) {
			ok(req.responseText === '{"abc":123}', "responseText is a JSON string");
		}),
		error: noError()
	});
});

asyncTest("Calls success on promise style", function() {

	var promise = window.net.ajax.get({
		url: apiUrl('/data/test-json')
	}).then(asyncHandler(function(req) {
		ok(true, 'should call success');
	}), noError());

	ok(typeof promise.then === 'function', 'has a then function');

});

test("Returns a promise object", function() {

	var promise = window.net.ajax.get({
		url: apiUrl('/data/test-json')
	});

	ok(typeof promise.then === 'function', 'has a then function');
	ok(typeof promise.fail === 'function', 'has a fail function');
	ok(typeof promise.succeed === 'function', 'has a success function');

});

test("Uses a string URL as first argument", function() {

	var promise = window.net.ajax.get('/data/test-json');

	ok(typeof promise.then === 'function', 'has a then function');
	ok(typeof promise.fail === 'function', 'has a fail function');
	ok(typeof promise.succeed === 'function', 'has a success function');

});

asyncTest("Makes a generic request, defaulting as GET", function() {
	window.net.ajax.request({
		url: apiUrl('/data/test'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'Hi There'), 'responseText matches');
		}),
		error: noError()
	});
});

asyncTest("Makes a generic request, using method GET", function() {
	window.net.ajax.request({
		method: 'GET',
		url: apiUrl('/data/test'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'Hi There'), 'responseText matches');
		}),
		error: noError()
	});
});

asyncTest("Makes a successful POST, using generic request", function() {
	window.net.ajax.request({
		method: 'POST',
		url: apiUrl('/test-post'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok(req.responseText === '{"abc":123}', "responseText is a JSON string");
		}),
		error: noError()
	});
});
