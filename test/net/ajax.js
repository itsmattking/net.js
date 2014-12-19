var ajax = window.net.ajax;

asyncTest("Makes a successful GET request using net.ajax.get", function() {
	ajax.get({
		url: apiUrl('/net/ajax'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'GET Request'), 'responseText matches expected output');
		}),
		error: noError()
	});
});

asyncTest("Makes a successful GET with first argument string as URL", function() {
	ajax.get(apiUrl('/net/ajax'), {
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'GET Request'), 'responseText matches expected output');
		}),
		error: noError()
	});
});

asyncTest("Makes a successful POST request using net.ajax.post", function() {
	ajax.post({
		url: apiUrl('/net/ajax'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
		}),
		error: noError()
	});
});

asyncTest("Handles not found request using net.ajax.get", function() {
	ajax.get({
		url: apiUrl('/data/test/not-found'),
		success: noSuccess(),
		error: asyncHandler(function(req) {
			ok(true, 'fires the error function');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok(req.status === 404, 'Is a not found error');
		})
	});
});

asyncTest("Handles invalid status when using net.ajax.get", function() {
	ajax.get({
		url: apiUrl('/net/ajax/status/500'),
		success: noSuccess(),
		error: asyncHandler(function(req) {
			ok(true, 'fires the error function');
			ok(req.status === 500, 'Is a 500 error');
		})
	});
});

asyncTest("Calls success handler when status < 400", function() {
	ajax.get({
		url: apiUrl('/net/ajax/status/304'),
		success: asyncHandler(function(req) {
			ok(true, 'fires the success function');
			ok(req.status === 304, 'matches the status code');
		}),
		error: noError()
	});
});

asyncTest("Follows a redirect", function() {
	ajax.get({
		url: apiUrl('/net/ajax/redirect'),
		success: asyncHandler(function(req) {
			ok(true, 'fires the success function');
			ok(req.responseText === 'Redirect Destination', 'goes to the right destination');
		}),
		error: noError()
	});
});

test("Returns a promise object", function() {
	var promise = ajax.get({
		url: apiUrl('/net/ajax')
	});

	ok(typeof promise.then === 'function', 'has a then function');
	ok(typeof promise.fail === 'function', 'has a fail function');
	ok(typeof promise.succeed === 'function', 'has a success function');
});

asyncTest("Calls success on promise style", function() {
	var promise = ajax.get({
		url: apiUrl('/net/ajax')
	}).then(asyncHandler(function(req) {
		ok(true, 'should call success');
	}), noError());
});

asyncTest("Makes a generic request, defaulting as GET", function() {
	ajax.request({
		url: apiUrl('/net/ajax'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'GET Request'), 'responseText matches expected output');
		}),
		error: noError()
	});
});

asyncTest("Makes a generic request using string as first argument", function() {
	ajax.request(apiUrl('/net/ajax'), {
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'GET Request'), 'responseText matches expected output');
		}),
		error: noError()
	});
});

asyncTest("Makes a generic request, using method GET", function() {
	ajax.request({
		method: 'GET',
		url: apiUrl('/net/ajax'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok((req.responseText === 'GET Request'), 'responseText matches expected output');
		}),
		error: noError()
	});
});

asyncTest("Makes a successful POST, using generic request", function() {
	ajax.request({
		method: 'POST',
		url: apiUrl('/net/ajax'),
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok(req.responseText === 'POST Request', "responseText matches expected output");
		}),
		error: noError()
	});
});

asyncTest("Adds headers to outgoing request", function() {
	ajax.get({
		url: apiUrl('/net/ajax'),
		headers: {
			"My-Custom-Header": "My Custom Value"
		},
		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok(req.responseText === 'GET Request', "responseText matches expected output");
			ok(req.getResponseHeader("My-Custom-Header") === 'My Custom Value', 'Header gets returned');
		}),
		error: noError()
	});
});

asyncTest("Invokes callbacks added after a promise has been fulfilled", function () {
	var promise = ajax.get({
		url: apiUrl('/net/ajax'),
		success: function (outerResponse, outerRequest) {
			window.setTimeout(function () {
				promise.then(function (innerResponse, innerRequest) {
					start();
					ok(outerResponse === innerResponse, 'original argument passed to then.');
					ok(outerRequest === innerRequest, 'original argument passed to then.');
				});
			}, 0);
		},
		error: noError()
	});
});

test("Serialize can convert a JS object into a query string with one param", function() {
	var obj = {param1: 'one'};

	ok(ajax.serialize(obj) === '?param1=one', 'turns object into query string with one param');
});

test("Serialize can convert a JS object into a query string with two params", function() {
	var obj = {param1: 'one', param2: 'two'};

	ok(ajax.serialize(obj) === '?param1=one&param2=two', 'turns object into query string with two params');
});

test("Serialize returns an empty string from an empty hash", function() {
	var obj = {};

	ok(ajax.serialize(obj) === '', 'turns object into empty string');
});

test("Serialize escapes values", function() {
	var obj = {param1: 'o&n,e', param2: 't<w;o'};

	ok(ajax.serialize(obj) === '?param1=o%26n%2Ce&param2=t%3Cw%3Bo', 'turns object into query string with serialized params');
});

asyncTest("Modifies URL for a GET request with data", function( assert ) {
	ajax.get({
		url: apiUrl('/net/ajax/with-query'),
		data: {param1: 'paramOne', param2: 'paramTwo'},

		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			assert.equal(req.responseText, 'url was /net/ajax/with-query?param1=paramOne&param2=paramTwo');
		}),
		error: noError()
	});
});

asyncTest("Does not modify URL for a GET request with empty data", function( assert ) {
	ajax.get({
		url: apiUrl('/net/ajax/with-query'),
		data: {},

		success: asyncHandler(function(req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			assert.equal(req.responseText, 'url was /net/ajax/with-query');
		}),
		error: noError()
	});
});
