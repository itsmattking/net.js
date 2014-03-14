function apiUrl(uri) {
	return ['http://127.0.0.1:8000', uri.replace(/^\/+/, '')].join('/');
}

asyncTest("Should fetch a thing", function() {
	window.net.json.get({
		url: apiUrl('data/test.json'),
		success: function(data) {
			ok(typeof data === 'object', "is an object");
			ok(('test' in data) === true, 'has a test key');
			start();
		},
		error: function() {
			start();
		}
	});
});

asyncTest("Should post a thing", function() {
	window.net.json.post({
		url: apiUrl('/test-post'),
		success: function(data, req) {
			ok(typeof data === 'object', "is an object");
			ok(('abc' in data) === true, 'has an abc key');
			start();
		},
		error: function() {
			ok(false === true, 'failed');
			start();
		}
	});
});
