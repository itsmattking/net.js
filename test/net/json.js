var json = window.net.json;

asyncTest('Makes a successful GET request and parses JSON', function() {
	json.get({
		url: apiUrl('/net/json'),
		success: asyncHandler(function(data) {
			ok((typeof data === 'object'), 'returns an object instance');
			ok((data.abc === 123), 'key is present and matches value');
		}),
		error: noError()
	});
});

asyncTest('Returns the request object as second argument', function() {
	json.get({
		url: apiUrl('/net/json'),
		success: asyncHandler(function(data, req) {
			ok(req.status === 200, 'returns a 200 status');
			ok((req instanceof window.XMLHttpRequest), 'returns an XMLHttpRequest instance');
			ok(req.responseText === '{"abc":123}', "responseText is a JSON string");
		}),
		error: noError()
	});
});

asyncTest('Calls error handler on bad JSON', function() {
	json.get({
		url: apiUrl('/net/json/malformed'),
		success: noSuccess(),
		error: asyncHandler(function(req) {
			ok(true, 'Should call error handler');
		})
	});
});

asyncTest('Does not error and calls success with empty object on empty response', function() {
	json.get({
		url: apiUrl('/net/json/empty'),
		success: asyncHandler(function(data) {
			ok((typeof data === 'object'), 'returns an object instance');
			ok((Object.keys(data).length === 0), 'is an empty object');
		}),
		error: noError()
	});
});

